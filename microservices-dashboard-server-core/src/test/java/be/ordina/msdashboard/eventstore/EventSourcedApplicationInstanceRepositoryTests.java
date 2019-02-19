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

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceMother;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class EventSourcedApplicationInstanceRepositoryTests {

	@Mock
	private ApplicationEventPublisher publisher;

	@InjectMocks
	private EventSourcedApplicationInstanceRepository repository;

	@Captor
	private ArgumentCaptor<ApplicationEvent> captor;

	@Test
	public void shouldReturnEmptyListWhenNoApplicationInstancesHaveBeenSaved() {
		List<ApplicationInstance> applicationInstances = this.repository.getAll();

		assertThat(applicationInstances).isEmpty();
	}

	@Test
	public void shouldReturnListWithSavedApplicationInstances() {
		this.repository.save(ApplicationInstanceMother.instance("a-1"));

		List<ApplicationInstance> applicationInstances = this.repository.getAll();

		assertThat(applicationInstances).extracting(ApplicationInstance::getId).contains("a-1");
	}

	@Test
	public void shouldReturnNullWhenNoApplicationInstanceHasBeenFound() {
		ApplicationInstance applicationInstance = this.repository.getById("unknown");

		assertThat(applicationInstance).isNull();
	}

	@Test
	public void shouldReturnInstanceWhenApplicationInstanceHasBeenFound() {
		this.repository.save(ApplicationInstanceMother.instance("a-1"));

		ApplicationInstance applicationInstance = this.repository.getById("a-1");

		assertThat(applicationInstance).isNotNull();
		assertThat(applicationInstance.getId()).isEqualTo("a-1");
	}

	@Test
	public void shouldDispatchEventsAndMarkChangesAsCommittedAfterSaving() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1");

		applicationInstance = this.repository.save(applicationInstance);

		verify(this.publisher).publishEvent(this.captor.capture());
		ApplicationEvent event = this.captor.getValue();

		assertThat(event).isInstanceOf(ApplicationInstanceCreated.class);
		assertThat(applicationInstance.getUncommittedChanges()).isEmpty();
	}

}
