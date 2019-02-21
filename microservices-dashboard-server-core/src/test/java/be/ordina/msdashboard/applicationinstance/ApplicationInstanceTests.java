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

import org.junit.Test;

import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceHealthUpdated;

import org.springframework.boot.actuate.health.Status;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Links;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author Tim Ysewyn
 */
public class ApplicationInstanceTests {

	@Test
	public void newlyCreatedInstanceShouldHaveOneUncommittedChange() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1");

		assertThat(applicationInstance.getUncommittedChanges()).hasSize(1);
	}

	@Test
	public void instanceShouldHaveNoUncommittedChangesAfterBeingMarkedAsCommitted() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1");
		applicationInstance.markChangesAsCommitted();

		assertThat(applicationInstance.getUncommittedChanges()).isEmpty();
	}

	@Test
	public void newlyCreatedInstanceShouldHaveUnknownHealthStatus() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1");

		assertThat(applicationInstance.getHealthStatus()).isEqualTo(Status.UNKNOWN);
	}

	@Test
	public void instanceShouldNotUpdateItsHealthStatusAgainIfNotChanged() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1");
		applicationInstance.markChangesAsCommitted();
		assertThat(applicationInstance.getHealthStatus()).isEqualTo(Status.UNKNOWN);

		applicationInstance.updateHealthStatus(Status.UP);
		assertThat(applicationInstance.getHealthStatus()).isEqualTo(Status.UP);
		assertThat(applicationInstance.getUncommittedChanges()).hasSize(1);
		assertThat(applicationInstance.getUncommittedChanges().get(0))
				.isInstanceOf(ApplicationInstanceHealthUpdated.class);

		applicationInstance.markChangesAsCommitted();

		applicationInstance.updateHealthStatus(Status.UP);
		assertThat(applicationInstance.getHealthStatus()).isEqualTo(Status.UP);
		assertThat(applicationInstance.getUncommittedChanges()).isEmpty();
	}

	@Test
	public void newlyCreatedInstanceWithoutActuatorEndpointsShouldReturnEmptyList() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1");

		assertThat(applicationInstance.getActuatorEndpoints()).isEmpty();
	}

	@Test
	public void newlyCreatedInstanceWithActuatorEndpointsShouldReturnListWithEndpoints() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1",
				URI.create("http://localhost:8080"),
				new Links(new Link("http://localhost:8080/actuator/health", "health")));

		assertThat(applicationInstance.getActuatorEndpoints()).hasSize(1);
	}

	@Test
	public void undefinedActuatorEndpointWillReturnEmptyOptional() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1",
				URI.create("http://localhost:8080"),
				new Links(new Link("http://localhost:8080/actuator/health", "health")));

		assertThat(applicationInstance.hasActuatorEndpointFor("not-defined-endpoint")).isFalse();
		assertThat(applicationInstance.getActuatorEndpoint("not-defined-endpoint")).isEmpty();
	}

	@Test
	public void definedActuatorEndpointWillReturnLink() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1",
				URI.create("http://localhost:8080"),
				new Links(new Link("http://localhost:8080/actuator/health", "health")));

		assertThat(applicationInstance.hasActuatorEndpointFor("health")).isTrue();
		assertThat(applicationInstance.getActuatorEndpoint("health")).isNotEmpty();
		assertThat(applicationInstance.getActuatorEndpoint("health"))
				.get().extracting(Link::getHref).isEqualTo("http://localhost:8080/actuator/health");
	}

}
