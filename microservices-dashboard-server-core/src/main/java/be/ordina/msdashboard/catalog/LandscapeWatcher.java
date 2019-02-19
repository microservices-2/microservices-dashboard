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

package be.ordina.msdashboard.catalog;

import java.util.Collection;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceService;

import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.discovery.event.HeartbeatEvent;
import org.springframework.context.event.EventListener;

import static java.util.stream.Collectors.toList;

/**
 * Watcher that will update the catalog with the latest discovered applications and their instances.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
public class LandscapeWatcher {

	private static final Logger logger = LoggerFactory.getLogger(LandscapeWatcher.class);

	private final DiscoveryClient discoveryClient;

	private final CatalogService catalogService;

	private final ApplicationInstanceService applicationInstanceService;

	LandscapeWatcher(DiscoveryClient discoveryClient, CatalogService catalogService,
			ApplicationInstanceService applicationInstanceService) {
		this.discoveryClient = discoveryClient;
		this.catalogService = catalogService;
		this.applicationInstanceService = applicationInstanceService;
	}

	@EventListener({ ApplicationStartedEvent.class, HeartbeatEvent.class })
	public void discoverLandscape() {
		logger.debug("Discovering landscape");
		List<String> applications = this.discoveryClient.getServices();
		applications = this.catalogService.updateListOfApplications(applications);
		processApplications(applications);
	}

	private void processApplications(Collection<String> applications) {
		applications.forEach(application -> {
			logger.debug("Discovering application instances for {}", application);
			List<ServiceInstance> instances = this.discoveryClient.getInstances(application);
			List<ApplicationInstance> applicationInstances = processServiceInstances(instances);
			this.catalogService.updateListOfInstancesForApplication(application, applicationInstances);
		});
	}

	private List<ApplicationInstance> processServiceInstances(Collection<ServiceInstance> serviceInstances) {
		return serviceInstances.stream()
				.map((serviceInstance) -> this.applicationInstanceService
						.getApplicationInstanceForServiceInstance(serviceInstance)
						.orElseGet(() -> this.applicationInstanceService
								.createApplicationInstanceForServiceInstance(serviceInstance)))
				.collect(toList());
	}

}
