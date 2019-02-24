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

import be.ordina.msdashboard.applicationinstance.events.ActuatorEndpointsUpdated;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceDeleted;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceHealthDataRetrieved;

import org.springframework.boot.actuate.health.Health;
import org.springframework.hateoas.Links;

/**
 * @author Tim Ysewyn
 */
public final class ApplicationInstanceEventMother {

	private ApplicationInstanceEventMother() {
	}

	public static ApplicationInstanceCreated applicationInstanceCreated(String id, String application) {
		return (ApplicationInstanceCreated) ApplicationInstance.Builder
				.forApplicationWithId(application, id)
				.baseUri(URI.create("http://localhost:8080"))
				.build()
				.getUncommittedChanges().get(0);
	}

	public static ApplicationInstanceHealthDataRetrieved applicationInstanceHealthDataRetrieved(String id, String application, Health health) {
		return new ApplicationInstanceHealthDataRetrieved(ApplicationInstance.Builder
				.forApplicationWithId(application, id)
				.baseUri(URI.create("http://localhost:8080"))
				.build().markChangesAsCommitted(), health);
	}

	public static ActuatorEndpointsUpdated actuatorEndpointsUpdated(String id, String application, Links actuatorEndpoints) {
		ApplicationInstance applicationInstance = ApplicationInstance.Builder
				.forApplicationWithId(application, id)
				.baseUri(URI.create("http://localhost:8080"))
				.build().markChangesAsCommitted();
		applicationInstance.updateActuatorEndpoints(actuatorEndpoints);
		return (ActuatorEndpointsUpdated) applicationInstance
				.getUncommittedChanges().get(0);
	}

	public static ApplicationInstanceDeleted applicationInstanceDeleted(String id, String application) {
		ApplicationInstance applicationInstance = ApplicationInstance.Builder
				.forApplicationWithId(application, id)
				.baseUri(URI.create("http://localhost:8080"))
				.build().markChangesAsCommitted();
		applicationInstance.delete();
		return (ApplicationInstanceDeleted) applicationInstance
				.getUncommittedChanges().get(0);
	}
}
