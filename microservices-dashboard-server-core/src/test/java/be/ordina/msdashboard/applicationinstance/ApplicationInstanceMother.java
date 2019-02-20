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

/**
 * @author Tim Ysewyn
 */
public final class ApplicationInstanceMother {

	private ApplicationInstanceMother() {
		throw new RuntimeException("Not allowed");
	}

	public static ApplicationInstance instance() {
		return instance("id");
	}

	public static ApplicationInstance instance(String id) {
		return instance(id, URI.create("http://loclahost:8080"));
	}

	public static ApplicationInstance instance(String id, URI baseUri) {
		return ApplicationInstance.Builder.withId(id).baseUri(baseUri).build();
	}

	public static ApplicationInstance instance(String id, URI baseUri, Map<String, URI> actuatorEndpoints) {
		return ApplicationInstance.Builder.withId(id).baseUri(baseUri).actuatorEndpoints(actuatorEndpoints).build();
	}
}
