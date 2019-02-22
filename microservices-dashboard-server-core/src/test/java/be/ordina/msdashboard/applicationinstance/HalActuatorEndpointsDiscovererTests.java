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

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import reactor.core.publisher.Mono;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkDiscoverer;
import org.springframework.hateoas.LinkDiscoverers;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.verify;
import static org.mockito.BDDMockito.verifyNoMoreInteractions;
import static org.mockito.BDDMockito.when;
import static org.mockito.Mockito.times;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class HalActuatorEndpointsDiscovererTests {

	@Mock
	private ServiceInstance serviceInstance;

	@Mock
	private WebClient webClient;
	@Mock
	private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;
	@Mock
	private WebClient.RequestHeadersSpec requestHeadersSpec;
	@Mock
	private ClientResponse clientResponse;

	@Mock
	private LinkDiscoverers linkDiscoverers;
	@Mock
	private LinkDiscoverer linkDiscoverer;

	@InjectMocks
	private HalActuatorEndpointsDiscoverer discoverer;

	@Before
	public void setup() {
		when(this.serviceInstance.getUri()).thenReturn(URI.create("http://localhost:8080"));
		when(this.webClient.get()).thenReturn(this.requestHeadersUriSpec);
		when(this.requestHeadersUriSpec.uri(any(URI.class))).thenReturn(this.requestHeadersSpec);
		when(this.requestHeadersSpec.exchange()).thenReturn(Mono.just(this.clientResponse));
		when(this.linkDiscoverers.getLinkDiscovererFor(any(MediaType.class)))
				.thenReturn(this.linkDiscoverer);
	}

	@Test
	public void shouldReturnEmptyListWhenUrlWasNotResolved() {
		when(this.clientResponse.toEntity(String.class))
				.thenReturn(Mono.just(ResponseEntity.notFound().build()));

		this.discoverer.findActuatorEndpoints(this.serviceInstance)
				.subscribe(actuatorEndpoints -> {
					verify(this.webClient).get();
					verifyNoMoreInteractions(this.webClient);

					assertThat(actuatorEndpoints).isEmpty();
				});
	}

	@Test
	public void shouldReturnEmptyListWhenNoBodyHasBeenSent() {
		when(this.clientResponse.toEntity(String.class))
				.thenReturn(Mono.just(ResponseEntity.ok().build()));

		this.discoverer.findActuatorEndpoints(this.serviceInstance)
				.subscribe(actuatorEndpoints -> {
					verify(this.webClient).get();
					verifyNoMoreInteractions(this.webClient);

					assertThat(actuatorEndpoints).isEmpty();
				});
	}

	@Test
	public void shouldReturnEmptyListWhenBodyIsEmpty() {
		when(this.clientResponse.toEntity(String.class))
				.thenReturn(Mono.just(ResponseEntity.ok("")));

		this.discoverer.findActuatorEndpoints(this.serviceInstance)
				.subscribe(actuatorEndpoints -> {
					verify(this.webClient).get();
					verifyNoMoreInteractions(this.webClient);

					assertThat(actuatorEndpoints).isEmpty();
				});
	}

	@Test
	public void shouldReturnEmptyListWhenNoLinkInResponse() {
		when(this.clientResponse.toEntity(String.class))
				.thenReturn(Mono.just(ResponseEntity.ok("{ }")));

		this.discoverer.findActuatorEndpoints(this.serviceInstance)
				.subscribe(actuatorEndpoints -> {
					verify(this.webClient).get();
					verifyNoMoreInteractions(this.webClient);

					assertThat(actuatorEndpoints).isEmpty();
				});
	}

	@Test
	public void shouldReturnEmptyListWhenNoRelsInResponse() {
		when(this.clientResponse.toEntity(String.class))
				.thenReturn(Mono.just(ResponseEntity.ok("{ _links: [] }")));

		this.discoverer.findActuatorEndpoints(this.serviceInstance)
				.subscribe(actuatorEndpoints -> {
					verify(this.webClient).get();
					verifyNoMoreInteractions(this.webClient);

					assertThat(actuatorEndpoints).isEmpty();
				});
	}

	@Test
	public void shouldReturnListWithDiscoveredEndpointsFromResponse() {
		String body = "{\"_links\":{\"self\":{\"href\":\"http://localhost:8080/actuator\",\"templated\":false},\"health-component-instance\":{\"href\":\"http://localhost:8080/actuator/health/{component}/{instance}\",\"templated\":true},\"health-component\":{\"href\":\"http://localhost:8080/actuator/health/{component}\",\"templated\":true},\"health\":{\"href\":\"http://localhost:8080/actuator/health\",\"templated\":false},\"info\":{\"href\":\"http://localhost:8080/actuator/info\",\"templated\":false}}}";
		when(this.clientResponse.toEntity(String.class))
				.thenReturn(Mono.just(ResponseEntity.ok(body)));
		when(this.linkDiscoverers.getLinkDiscovererFor(MediaTypes.HAL_JSON_UTF8))
				.thenReturn(this.linkDiscoverer);
		when(this.linkDiscoverer.findLinkWithRel("self", body))
				.thenReturn(new Link("http://localhost:8080/actuator", "self"));
		when(this.linkDiscoverer.findLinkWithRel("health-component-instance", body))
				.thenReturn(new Link("http://localhost:8080/actuator/health/{component}/instance/{instance}", "health-component-instance"));
		when(this.linkDiscoverer.findLinkWithRel("health-component", body))
				.thenReturn(new Link("http://localhost:8080/actuator/health/{component}", "health-component"));
		when(this.linkDiscoverer.findLinkWithRel("health", body))
				.thenReturn(new Link("http://localhost:8080/actuator/health", "health"));
		when(this.linkDiscoverer.findLinkWithRel("info", body))
				.thenReturn(new Link("http://localhost:8080/actuator/info", "info"));

		this.discoverer.findActuatorEndpoints(this.serviceInstance)
				.subscribe(actuatorEndpoints -> {
					assertThat(actuatorEndpoints).hasSize(5);

					verify(this.webClient).get();
					verifyNoMoreInteractions(this.webClient);
					verify(this.requestHeadersSpec).exchange();
					verifyNoMoreInteractions(this.requestHeadersSpec);
					verify(this.requestHeadersUriSpec).uri(URI.create("http://localhost:8080/actuator"));
					verifyNoMoreInteractions(this.requestHeadersUriSpec);
					verify(this.clientResponse).toEntity(String.class);
					verifyNoMoreInteractions(this.clientResponse);
					verify(this.linkDiscoverers, times(5)).getLinkDiscovererFor(MediaTypes.HAL_JSON_UTF8);
					verifyNoMoreInteractions(this.linkDiscoverers);
					verify(this.linkDiscoverer).findLinkWithRel("self", body);
					verify(this.linkDiscoverer).findLinkWithRel("health-component-instance", body);
					verify(this.linkDiscoverer).findLinkWithRel("health-component", body);
					verify(this.linkDiscoverer).findLinkWithRel("health", body);
					verify(this.linkDiscoverer).findLinkWithRel("info", body);
					verifyNoMoreInteractions(this.linkDiscoverer);
				});
	}

}
