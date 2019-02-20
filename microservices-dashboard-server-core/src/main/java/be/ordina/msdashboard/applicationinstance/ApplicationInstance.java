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

import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceHealthUpdated;

import org.springframework.boot.actuate.health.Status;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.context.ApplicationEvent;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * The representation of an application's instance.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
public final class ApplicationInstance {

	private List<ApplicationEvent> changes = new ArrayList<>();

	private final String id;
	private final UriComponentsBuilder uriComponentsBuilder;
	private Status healthStatus;

	private ApplicationInstance(Builder builder) {
		this.id = builder.id;
		this.uriComponentsBuilder = UriComponentsBuilder.fromUri(builder.baseUri);
		this.healthStatus = builder.healthStatus;
		this.changes.add(new ApplicationInstanceCreated(this));
	}

	public String getId() {
		return this.id;
	}

	public Status getHealthStatus() {
		return this.healthStatus;
	}

	public void updateHealthStatus(Status healthStatus) {
		if (this.healthStatus != healthStatus) {
			this.healthStatus = healthStatus;
			this.changes.add(new ApplicationInstanceHealthUpdated(this));
		}
	}

	public URI getHealthEndpoint() {
		return this.uriComponentsBuilder.cloneBuilder().path("/actuator/health").build().toUri();
	}

	public List<ApplicationEvent> getUncommittedChanges() {
		return this.changes;
	}

	public ApplicationInstance markChangesAsCommitted() {
		this.changes.clear();
		return this;
	}

	static ApplicationInstance from(ServiceInstance serviceInstance) {
		return Builder.withId(serviceInstance.getInstanceId()).baseUri(serviceInstance.getUri()).build();
	}

	/**
	 * Builder to create a new {@link ApplicationInstance application instance}.
	 *
	 * @author Tim Ysewyn
	 */
	static final class Builder {

		private final String id;
		private URI baseUri;
		private Status healthStatus = Status.UNKNOWN;

		private Builder(String id) {
			this.id = id;
		}

		static Builder withId(String id) {
			return new Builder(id);
		}

		Builder baseUri(URI baseUri) {
			this.baseUri = baseUri;
			return this;
		}

		Builder healthStatus(Status healthStatus) {
			this.healthStatus = healthStatus;
			return this;
		}

		ApplicationInstance build() {
			return new ApplicationInstance(this);
		}

	}
}
