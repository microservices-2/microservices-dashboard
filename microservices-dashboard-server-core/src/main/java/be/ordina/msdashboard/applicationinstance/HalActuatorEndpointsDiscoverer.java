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

import java.net.URI;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.hateoas.LinkDiscoverers;
import org.springframework.hateoas.Links;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * An {@link ActuatorEndpointsDiscoverer actuator endpoints discoverer} that uses HAL to find the links.
 *
 * @author Tim Ysewyn
 */
public class HalActuatorEndpointsDiscoverer implements ActuatorEndpointsDiscoverer {

	private static final Logger logger = LoggerFactory.getLogger(HalActuatorEndpointsDiscoverer.class);
	private static final String LINK_PATH = "_links";

	private final WebClient webClient;
	private final LinkDiscoverers linkDiscoverers;

	public HalActuatorEndpointsDiscoverer(WebClient webClient, LinkDiscoverers linkDiscoverers) {
		this.webClient = webClient;
		this.linkDiscoverers = linkDiscoverers;
	}

	@Override
	public Mono<Links> findActuatorEndpoints(ServiceInstance serviceInstance) {
		URI actuatorBaseUri = serviceInstance.getUri().resolve("/actuator");
		return this.webClient.get().uri(actuatorBaseUri)
				.exchange()
				.flatMap(c -> c.toEntity(String.class))
				.map(this::discoverLinks)
				.onErrorResume(ex -> {
					logger.error("Could not discover the actuator endpoints, skipping the HAL discoverer", ex);
					return Mono.just(new Links());
				});
	}

	private Links discoverLinks(ResponseEntity<String> response) {
		Links links = new Links();
		if (!response.getStatusCode().isError()
				&& response.hasBody()
				&& !StringUtils.isEmpty(response.getBody())) {
			MediaType mediaType = Optional.ofNullable(response.getHeaders().getContentType())
					.orElse(MediaTypes.HAL_JSON_UTF8);
			links = createLinksFrom(response.getBody(), mediaType);
		}
		return links;
	}

	private Links createLinksFrom(String body, MediaType mediaType) {
		Links links = new Links();
		try {
			Object parseResult = JsonPath.read(body, LINK_PATH);

			if (parseResult instanceof Map) {
				Set<String> rels = ((Map<String, Object>) parseResult).keySet();
				links = extractActuatorEndpoints(body, mediaType, rels);
			}
		}
		catch (PathNotFoundException pnfe) {
			logger.debug("{} not found in response", LINK_PATH, pnfe);
		}
		return links;
	}

	private Links extractActuatorEndpoints(String body, MediaType mediaType, Set<String> rels) {
		return rels.parallelStream()
				.map(rel ->
						this.linkDiscoverers.getLinkDiscovererFor(mediaType)
								.findLinkWithRel(rel, body)
				)
				.collect(Collectors.collectingAndThen(Collectors.toList(), Links::new));
	}
}
