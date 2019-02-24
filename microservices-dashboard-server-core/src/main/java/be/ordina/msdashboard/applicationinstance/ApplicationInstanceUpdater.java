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

import be.ordina.msdashboard.applicationinstance.commands.CreateApplicationInstance;
import be.ordina.msdashboard.applicationinstance.commands.DeleteApplicationInstance;
import be.ordina.msdashboard.applicationinstance.commands.UpdateActuatorEndpoints;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDiscovered;

import org.springframework.context.event.EventListener;

/**
 * Will create, update or delete {@link ApplicationInstance applications instances} based on events
 * that are happening throughout the system.
 *
 * @author Tim Ysewyn
 */
class ApplicationInstanceUpdater {

	private final ApplicationInstanceService applicationInstanceService;
	private final ActuatorEndpointsDiscovererService actuatorEndpointsDiscovererService;

	ApplicationInstanceUpdater(ApplicationInstanceService applicationInstanceService,
			ActuatorEndpointsDiscovererService actuatorEndpointsDiscovererService) {
		this.applicationInstanceService = applicationInstanceService;
		this.actuatorEndpointsDiscovererService = actuatorEndpointsDiscovererService;
	}

	@EventListener(ServiceInstanceDiscovered.class)
	public void createNewApplicationInstance(ServiceInstanceDiscovered event) {
		CreateApplicationInstance command = new CreateApplicationInstance(event.getServiceInstance());
		this.applicationInstanceService.createApplicationInstance(command);
	}

	@EventListener(ServiceInstanceDisappeared.class)
	public void deleteApplicationInstance(ServiceInstanceDisappeared event) {
		DeleteApplicationInstance command = new DeleteApplicationInstance(event.getServiceInstanceId());
		this.applicationInstanceService.deleteApplicationInstance(command);
	}

	@EventListener(ApplicationInstanceCreated.class)
	public void discoverActuatorEndpoints(ApplicationInstanceCreated event) {
		ApplicationInstance applicationInstance = event.getApplicationInstance();
		this.actuatorEndpointsDiscovererService.findActuatorEndpoints(applicationInstance)
				.subscribe(actuatorEndpoints -> {
					UpdateActuatorEndpoints command = new UpdateActuatorEndpoints(applicationInstance.getId(),
							actuatorEndpoints);
					this.applicationInstanceService.updateActuatorEndpoints(command);
				});
	}
}
