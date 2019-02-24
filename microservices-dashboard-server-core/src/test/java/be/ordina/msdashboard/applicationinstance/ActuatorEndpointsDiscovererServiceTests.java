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

import java.util.Collections;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import reactor.core.publisher.Mono;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.Links;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class ActuatorEndpointsDiscovererServiceTests {

	@Mock
	private HalActuatorEndpointsDiscoverer halActuatorEndpointsDiscoverer;

	@Mock
	private ActuatorEndpointsDiscoverer otherActuatorEndpointsDiscoverer;

	private ApplicationInstance applicationInstance;
	private ActuatorEndpointsDiscovererService service;

	@Before
	public void setup() {
		this.applicationInstance = ApplicationInstanceMother.instance("a-1", "a");
		this.service = new ActuatorEndpointsDiscovererService(this.halActuatorEndpointsDiscoverer,
				Collections.singletonList(this.otherActuatorEndpointsDiscoverer));
		when(this.halActuatorEndpointsDiscoverer.findActuatorEndpoints(this.applicationInstance))
				.thenReturn(Mono.just(new Links()));
		when(this.otherActuatorEndpointsDiscoverer.findActuatorEndpoints(this.applicationInstance))
				.thenReturn(Mono.just(new Links()));
	}

	@Test
	public void shouldReturnEmptyMapWhenNoEndpointsHaveBeenDiscovered() {
		this.service.findActuatorEndpoints(this.applicationInstance)
				.subscribe(actuatorEndpoints -> {
					verify(this.halActuatorEndpointsDiscoverer).findActuatorEndpoints(this.applicationInstance);
					verifyNoMoreInteractions(this.halActuatorEndpointsDiscoverer);

					assertThat(actuatorEndpoints).isEmpty();
				});
	}

	@Test
	public void shouldReturnMonoWithDiscoveredEndpointsWhenWeOnlyHaveTheHalDiscoverer() {
		this.service = new ActuatorEndpointsDiscovererService(this.halActuatorEndpointsDiscoverer,
				Collections.emptyList());

		when(this.halActuatorEndpointsDiscoverer.findActuatorEndpoints(this.applicationInstance))
				.thenReturn(Mono.just(new Links(new Link("http://localhost:8080/actuator/health", "health"))));

		this.service.findActuatorEndpoints(this.applicationInstance)
				.subscribe(actuatorEndpoints -> {
					verify(this.halActuatorEndpointsDiscoverer).findActuatorEndpoints(this.applicationInstance);
					verifyNoMoreInteractions(this.halActuatorEndpointsDiscoverer);

					assertThat(actuatorEndpoints).isNotEmpty();
					assertThat(actuatorEndpoints.hasLink("health")).isTrue();
					assertThat(actuatorEndpoints.getLink("health").getHref()).isEqualTo("http://localhost:8080/actuator/health");
				});
	}

	@Test
	public void shouldReturnMapOfDiscoveredEndpointsByHalDiscoverer() {
		when(this.halActuatorEndpointsDiscoverer.findActuatorEndpoints(this.applicationInstance))
				.thenReturn(Mono.just(new Links(new Link("http://localhost:8080/actuator/health", "health"))));

		this.service.findActuatorEndpoints(this.applicationInstance)
				.subscribe(actuatorEndpoints -> {
					verify(this.halActuatorEndpointsDiscoverer).findActuatorEndpoints(this.applicationInstance);
					verifyNoMoreInteractions(this.halActuatorEndpointsDiscoverer);

					assertThat(actuatorEndpoints).isNotEmpty();
					assertThat(actuatorEndpoints.hasLink("health")).isTrue();
					assertThat(actuatorEndpoints.getLink("health").getHref()).isEqualTo("http://localhost:8080/actuator/health");
				});
	}

	@Test
	public void shouldReturnMapOfDiscoveredEndpointsByAnotherDiscovererThanDefault() {
		when(this.otherActuatorEndpointsDiscoverer.findActuatorEndpoints(this.applicationInstance))
				.thenReturn(Mono.just(new Links(new Link("http://localhost:8081/actuator/health", "health"))));

		this.service.findActuatorEndpoints(this.applicationInstance)
				.subscribe(actuatorEndpoints -> {
					verify(this.halActuatorEndpointsDiscoverer).findActuatorEndpoints(this.applicationInstance);
					verifyNoMoreInteractions(this.halActuatorEndpointsDiscoverer);

					assertThat(actuatorEndpoints).isNotEmpty();
					assertThat(actuatorEndpoints.hasLink("health")).isTrue();
					assertThat(actuatorEndpoints.getLink("health").getHref()).isEqualTo("http://localhost:8081/actuator/health");
				});
	}

	@Test
	public void shouldReturnMergedMapOfDiscoveredEndpointsWithHalTakingPrecedence() {
		when(this.otherActuatorEndpointsDiscoverer.findActuatorEndpoints(this.applicationInstance))
				.thenReturn(Mono.just(new Links(new Link("http://localhost:8081/actuator/health", "health"),
						new Link("http://localhost:8081/actuator/info", "info"))));
		when(this.halActuatorEndpointsDiscoverer.findActuatorEndpoints(this.applicationInstance))
				.thenReturn(Mono.just(new Links(new Link("http://localhost:8080/actuator/health", "health"))));

		this.service.findActuatorEndpoints(this.applicationInstance)
				.subscribe(actuatorEndpoints -> {

					verify(this.otherActuatorEndpointsDiscoverer).findActuatorEndpoints(this.applicationInstance);
					verifyNoMoreInteractions(this.otherActuatorEndpointsDiscoverer);

					verify(this.halActuatorEndpointsDiscoverer).findActuatorEndpoints(this.applicationInstance);
					verifyNoMoreInteractions(this.halActuatorEndpointsDiscoverer);

					assertThat(actuatorEndpoints).isNotEmpty();
					assertThat(actuatorEndpoints).hasSize(2);
					assertThat(actuatorEndpoints.hasLink("info")).isTrue();
					assertThat(actuatorEndpoints.getLink("info").getHref()).isEqualTo("http://localhost:8081/actuator/info");
					assertThat(actuatorEndpoints.hasLink("health")).isTrue();
					assertThat(actuatorEndpoints.getLink("health").getHref()).isEqualTo("http://localhost:8080/actuator/health");
				});
	}

	@Test
	public void shouldReturnAnEmptyMonoWhenSomethingGoesWrong() {
		when(this.otherActuatorEndpointsDiscoverer.findActuatorEndpoints(this.applicationInstance))
				.thenReturn(Mono.just(new Links(new Link("http://localhost:8081/actuator/health", "health"),
						new Link("http://localhost:8081/actuator/info", "info"))));
		when(this.halActuatorEndpointsDiscoverer.findActuatorEndpoints(this.applicationInstance))
				.thenReturn(Mono.error(new RuntimeException("OOPSIE")));

		this.service.findActuatorEndpoints(this.applicationInstance)
				.subscribe(actuatorEndpoints -> {

					verify(this.otherActuatorEndpointsDiscoverer).findActuatorEndpoints(this.applicationInstance);
					verifyNoMoreInteractions(this.otherActuatorEndpointsDiscoverer);

					verify(this.halActuatorEndpointsDiscoverer).findActuatorEndpoints(this.applicationInstance);
					verifyNoMoreInteractions(this.halActuatorEndpointsDiscoverer);

					assertThat(actuatorEndpoints).isEmpty();
				});
	}
}
