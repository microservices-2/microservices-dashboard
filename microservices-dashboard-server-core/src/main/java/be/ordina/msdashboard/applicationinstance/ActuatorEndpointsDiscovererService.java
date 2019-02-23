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

import java.util.ArrayList;
import java.util.List;
import java.util.function.BiFunction;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Links;

/**
 * Service that will discover the actuator endpoints for a given application.
 *
 * @author Tim Ysewyn
 */
class ActuatorEndpointsDiscovererService {

	private static final Logger logger = LoggerFactory.getLogger(ActuatorEndpointsDiscovererService.class);

	private final HalActuatorEndpointsDiscoverer halActuatorEndpointsDiscoverer;

	private final List<ActuatorEndpointsDiscoverer> actuatorEndpointsDiscoverers;

	ActuatorEndpointsDiscovererService(HalActuatorEndpointsDiscoverer halActuatorEndpointsDiscoverer,
			List<ActuatorEndpointsDiscoverer> actuatorEndpointsDiscoverers) {
		this.halActuatorEndpointsDiscoverer = halActuatorEndpointsDiscoverer;
		this.actuatorEndpointsDiscoverers = actuatorEndpointsDiscoverers;
	}

	Mono<Links> findActuatorEndpoints(ServiceInstance serviceInstance) {
		return Flux.fromIterable(this.actuatorEndpointsDiscoverers)
				.flatMap(a -> a.findActuatorEndpoints(serviceInstance))
				.concatWith(this.halActuatorEndpointsDiscoverer.findActuatorEndpoints(serviceInstance))
				.reduce(reduceActuatorEndpoints())
				.onErrorResume(ex -> {
					logger.error("Something went wrong while discovering the actuator endpoints", ex);
					return Mono.empty();
				});
	}

	private BiFunction<Links, Links, Links> reduceActuatorEndpoints() {
		return (links, links2) -> {
			List<Link> newLinks = new ArrayList<>();
			links2.forEach(newLinks::add);
			links.forEach(link -> {
				if (!links2.hasLink(link.getRel())) {
					newLinks.add(link);
				}
			});
			return new Links(newLinks);
		};
	}
}
