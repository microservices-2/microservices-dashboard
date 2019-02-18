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

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * The representation of an application's instance.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
public class ApplicationInstance {

	private final String id;
	private final UriComponentsBuilder uriComponentsBuilder;

	protected ApplicationInstance(String id, URI baseUrl) {
		this.id = id;
		this.uriComponentsBuilder = UriComponentsBuilder.fromUri(baseUrl);
	}

	private ApplicationInstance(ServiceInstance serviceInstance) {
		this(serviceInstance.getInstanceId(), serviceInstance.getUri());
	}

	public String getId() {
		return this.id;
	}

	public URI getHealthEndpoint() {
		return this.uriComponentsBuilder.cloneBuilder().path("/actuator/health").build().toUri();
	}

	static ApplicationInstance from(ServiceInstance serviceInstance) {
		return new ApplicationInstance(serviceInstance);
	}
}
