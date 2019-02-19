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

package be.ordina.msdashboard.eventstore;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceRepository;

import org.springframework.context.ApplicationEventPublisher;

/**
 * In-memory event sourced {@link ApplicationInstanceRepository application instance repository}.
 *
 * @author Tim Ysewyn
 */
class EventSourcedApplicationInstanceRepository implements ApplicationInstanceRepository {

	private final ApplicationEventPublisher applicationEventPublisher;
	private final Map<String, ApplicationInstance> applicationInstances = new HashMap<>();

	EventSourcedApplicationInstanceRepository(ApplicationEventPublisher applicationEventPublisher) {
		this.applicationEventPublisher = applicationEventPublisher;
	}

	@Override
	public List<ApplicationInstance> getAll() {
		return new ArrayList<>(this.applicationInstances.values());
	}

	@Override
	public ApplicationInstance getById(String id) {
		return this.applicationInstances.get(id);
	}

	@Override
	public ApplicationInstance save(ApplicationInstance applicationInstance) {
		applicationInstance.getUncommittedChanges()
				.forEach(this.applicationEventPublisher::publishEvent);
		ApplicationInstance savedApplicationInstance = applicationInstance.markChangesAsCommitted();
		this.applicationInstances.put(savedApplicationInstance.getId(), savedApplicationInstance);
		return savedApplicationInstance;
	}
}
