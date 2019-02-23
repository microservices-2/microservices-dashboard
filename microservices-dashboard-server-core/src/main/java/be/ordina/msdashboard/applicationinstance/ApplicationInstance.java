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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceDeleted;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceHealthUpdated;

import org.springframework.boot.actuate.health.Status;
import org.springframework.context.ApplicationEvent;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Links;

/**
 * The representation of an application's instance.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
public final class ApplicationInstance {

	private List<ApplicationEvent> changes = new ArrayList<>();

	private final String id;
	private final String application;
	private final URI baseUri;
	private Status healthStatus = Status.UNKNOWN;
	private Links actuatorEndpoints;

	private ApplicationInstance(Builder builder) {
		this.id = builder.id;
		this.application = builder.application;
		this.baseUri = builder.baseUri;
		this.actuatorEndpoints = builder.actuatorEndpoints;
		this.changes.add(new ApplicationInstanceCreated(this));
	}

	public String getId() {
		return this.id;
	}

	public String getApplication() {
		return this.application;
	}

	public Status getHealthStatus() {
		return this.healthStatus;
	}

	void updateHealthStatus(Status healthStatus) {
		if (!this.healthStatus.equals(healthStatus)) {
			this.healthStatus = healthStatus;
			this.changes.add(new ApplicationInstanceHealthUpdated(this));
		}
	}

	public Links getActuatorEndpoints() {
		return this.actuatorEndpoints;
	}

	public boolean hasActuatorEndpointFor(String endpoint) {
		return this.actuatorEndpoints.hasLink(endpoint);
	}

	public Optional<Link> getActuatorEndpoint(String endpoint) {
		return Optional.ofNullable(this.actuatorEndpoints.getLink(endpoint));
	}

	public void delete() {
		this.changes.add(new ApplicationInstanceDeleted(this));
	}

	public List<ApplicationEvent> getUncommittedChanges() {
		return this.changes;
	}

	public ApplicationInstance markChangesAsCommitted() {
		this.changes.clear();
		return this;
	}

	/**
	 * Builder to create a new {@link ApplicationInstance application instance}.
	 *
	 * @author Tim Ysewyn
	 */
	static final class Builder {

		private final String id;
		private final String application;
		private URI baseUri;
		private Links actuatorEndpoints = new Links();

		private Builder(String id, String application) {
			this.id = id;
			this.application = application;
		}

		static Builder forApplicationWithId(String application, String id) {
			return new Builder(id, application);
		}

		Builder baseUri(URI baseUri) {
			this.baseUri = baseUri;
			return this;
		}


		Builder actuatorEndpoints(Links actuatorEndpoints) {
			this.actuatorEndpoints = actuatorEndpoints;
			return this;
		}

		ApplicationInstance build() {
			return new ApplicationInstance(this);
		}

	}
}
