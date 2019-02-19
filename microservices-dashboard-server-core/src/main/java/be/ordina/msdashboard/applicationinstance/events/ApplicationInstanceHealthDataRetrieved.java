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

package be.ordina.msdashboard.applicationinstance.events;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;

import org.springframework.boot.actuate.health.Health;
import org.springframework.context.ApplicationEvent;

/**
 * An {@link ApplicationEvent application event} which signals successful retrieval of an instance its health data.
 *
 * @author Dieter Hubau
 */
public class ApplicationInstanceHealthDataRetrieved extends ApplicationEvent {

	private Health health;

	public ApplicationInstanceHealthDataRetrieved(ApplicationInstance instance, Health health) {
		super(instance);
		this.health = health;
	}

	public Health getHealth() {
		return this.health;
	}

}
