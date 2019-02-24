/*
 * Copyright 2015-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package be.ordina.msdashboard.applicationinstance;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import be.ordina.msdashboard.applicationinstance.commands.UpdateApplicationInstanceHealth;
import be.ordina.msdashboard.applicationinstance.events.ActuatorEndpointsUpdated;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceHealthDataRetrievalFailed;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceHealthDataRetrieved;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.Status;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Watcher that will check an application instance its health endpoint.
 *
 * @author Dieter Hubau
 * @author Tim Ysewyn
 */
public class ApplicationInstanceHealthWatcher {

	private static final Logger logger = LoggerFactory.getLogger(ApplicationInstanceHealthWatcher.class);

	private final WebClient webClient;
	private final ApplicationInstanceService applicationInstanceService;
	private final ApplicationEventPublisher publisher;

	ApplicationInstanceHealthWatcher(ApplicationInstanceService applicationInstanceService,
			WebClient webClient, ApplicationEventPublisher publisher) {
		this.applicationInstanceService = applicationInstanceService;
		this.webClient = webClient;
		this.publisher = publisher;
	}

	@EventListener({ ActuatorEndpointsUpdated.class })
	public void retrieveHealthData(ActuatorEndpointsUpdated event) {
		ApplicationInstance applicationInstance = event.getApplicationInstance();
		if (applicationInstance.hasActuatorEndpointFor("health")) {
			retrieveHealthData(applicationInstance);
		}
	}

	@Scheduled(fixedRateString = "${applicationinstance.healthwatcher.rate:10000}")
	public void retrieveHealthDataForAllApplicationInstances() {
		logger.debug("Retrieving [HEALTH] data for all application instances");
		this.applicationInstanceService.getApplicationInstances()
				.parallelStream()
				.filter(instance -> instance.getState() != ApplicationInstance.State.DELETED)
				.filter(instance -> instance.hasActuatorEndpointFor("health"))
				.forEach(this::retrieveHealthData);
	}

	private void retrieveHealthData(ApplicationInstance instance) {
		instance.getActuatorEndpoint("health").ifPresent(link -> {
			logger.debug("Retrieving [HEALTH] data for {}", instance.getId());
			this.webClient.get().uri(link.getHref()).retrieve().bodyToMono(HealthWrapper.class)
					.defaultIfEmpty(new HealthWrapper(Status.UNKNOWN, new HashMap<>()))
					.map(HealthWrapper::getHealth)
					.doOnError(exception -> {
						logger.debug("Could not retrieve health information for [{}]", link.getHref(), exception);
						this.publisher.publishEvent(new ApplicationInstanceHealthDataRetrievalFailed(instance));
					})
					.subscribe(healthInfo -> {
						logger.debug("Retrieved health information for application instance [{}]", instance.getId());
						this.publisher.publishEvent(new ApplicationInstanceHealthDataRetrieved(instance, healthInfo));
					});
		});
	}

	@EventListener({ ApplicationInstanceHealthDataRetrieved.class })
	public void updateHealthForApplicationInstance(ApplicationInstanceHealthDataRetrieved event) {
		UpdateApplicationInstanceHealth command =
				new UpdateApplicationInstanceHealth(event.getApplicationInstance().getId(),
						event.getHealth().getStatus());
		this.applicationInstanceService.updateApplicationInstanceHealth(command);
	}

	/**
	 * Wrapper for the Health class since it doesn't have correct constructors for
	 * Jackson.
	 */
	static class HealthWrapper {

		private Health health;

		@JsonCreator
		HealthWrapper(@JsonProperty("status") Status status, @JsonProperty("details") Map<String, Object> details) {
			this.health = Health.status(status).withDetails(details == null ? new HashMap<>() : details).build();
		}

		private Health getHealth() {
			return this.health;
		}

	}

}
