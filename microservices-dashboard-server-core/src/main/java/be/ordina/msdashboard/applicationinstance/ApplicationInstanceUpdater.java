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

import be.ordina.msdashboard.discovery.events.ServiceInstanceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDiscovered;

import org.springframework.context.event.EventListener;

/**
 * Will create or delete {@link ApplicationInstance applications instances} based on events that are happening throughout the system.
 *
 * @author Tim Ysewyn
 */
class ApplicationInstanceUpdater {

	private final ApplicationInstanceService applicationInstanceService;

	ApplicationInstanceUpdater(ApplicationInstanceService applicationInstanceService) {
		this.applicationInstanceService = applicationInstanceService;
	}

	@EventListener(ServiceInstanceDiscovered.class)
	public void createNewApplicationInstance(ServiceInstanceDiscovered event) {
		this.applicationInstanceService.createApplicationInstanceForServiceInstance(event.getServiceInstance());
	}

	@EventListener(ServiceInstanceDisappeared.class)
	public void deleteApplicationInstance(ServiceInstanceDisappeared event) {
		this.applicationInstanceService.deleteApplicationInstance(event.getServiceInstanceId());
	}
}
