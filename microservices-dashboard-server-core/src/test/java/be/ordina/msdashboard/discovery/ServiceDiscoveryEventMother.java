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

package be.ordina.msdashboard.discovery;

import be.ordina.msdashboard.discovery.events.ServiceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceDiscovered;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDiscovered;

import org.springframework.cloud.client.ServiceInstance;

/**
 * @author Tim Ysewyn
 */
public final class ServiceDiscoveryEventMother {

	private ServiceDiscoveryEventMother() {
	}

	public static ServiceDiscovered newServiceDiscovered(String service) {
		return new ServiceDiscovered(service);
	}

	public static ServiceDisappeared serviceDisappeared(String service) {
		return new ServiceDisappeared(service);
	}

	public static ServiceInstanceDiscovered newServiceInstanceDiscovered(ServiceInstance serviceInstance) {
		return new ServiceInstanceDiscovered(serviceInstance);
	}

	public static ServiceInstanceDisappeared serviceInstanceDisappeared(String instanceId) {
		return new ServiceInstanceDisappeared(instanceId);
	}

}
