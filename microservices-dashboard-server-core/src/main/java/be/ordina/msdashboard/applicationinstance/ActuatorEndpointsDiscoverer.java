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

import reactor.core.publisher.Mono;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.hateoas.Links;

/**
 * Interface to allow discovering actuator endpoints.
 *
 * @author Tim Ysewyn
 */
public interface ActuatorEndpointsDiscoverer {

	/**
	 * Returns all links found for the given {@link ServiceInstance service instance}.
	 *
	 * @param serviceInstance a service instance
	 * @return {@link Mono} consisting out of the discovered actuator endpoint {@link Links}.
	 */
	Mono<Links> findActuatorEndpoints(ServiceInstance serviceInstance);
}
