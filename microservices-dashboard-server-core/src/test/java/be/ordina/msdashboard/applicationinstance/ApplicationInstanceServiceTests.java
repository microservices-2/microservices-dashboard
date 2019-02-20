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
import java.util.List;
import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import org.springframework.boot.actuate.health.Status;
import org.springframework.cloud.client.ServiceInstance;

import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class ApplicationInstanceServiceTests {

	@Mock
	private ServiceInstance serviceInstance;

	@Mock
	private ApplicationInstanceRepository repository;

	@InjectMocks
	private ApplicationInstanceService service;

	@Captor
	private ArgumentCaptor<ApplicationInstance> applicationInstanceArgumentCaptor;

	@Test
	public void shouldRetrieveApplicationInstanceFromRepository() {
		when(this.serviceInstance.getInstanceId()).thenReturn("a-1");
		when(this.repository.getById("a-1")).thenReturn(ApplicationInstanceMother.instance("a-1"));

		Optional<ApplicationInstance> applicationInstance = this.service.getApplicationInstanceForServiceInstance(this.serviceInstance);

		verify(this.repository).getById("a-1");
		assertThat(applicationInstance).isNotEmpty();
		assertThat(applicationInstance).get().extracting(ApplicationInstance::getId).isEqualTo("a-1");
	}

	@Test
	public void shouldCreateApplicationInstanceAndSaveInRepository() {
		when(this.serviceInstance.getInstanceId()).thenReturn("a-1");
		when(this.serviceInstance.getUri()).thenReturn(URI.create("http://localhost:8080"));
		when(this.repository.save(any(ApplicationInstance.class)))
				.thenAnswer((Answer<ApplicationInstance>) invocation -> invocation.getArgument(0));

		ApplicationInstance applicationInstance = this.service.createApplicationInstanceForServiceInstance(this.serviceInstance);

		verify(this.repository).save(this.applicationInstanceArgumentCaptor.capture());
		assertThat(applicationInstance.getId()).isEqualTo("a-1");
	}

	@Test
	public void shouldRetrieveAllApplicationInstancesFromRepository() {
		when(this.repository.getAll()).thenReturn(singletonList(ApplicationInstanceMother.instance("a-1")));

		List<ApplicationInstance> applicationInstances = this.service.getApplicationInstances();

		verify(this.repository).getAll();
		assertThat(applicationInstances).isNotEmpty();
	}

	@Test
	public void shouldUpdateTheHealthOfAnApplicationInstance() {
		when(this.repository.getById("a-1")).thenReturn(ApplicationInstanceMother.instance("a-1"));
		when(this.repository.save(any(ApplicationInstance.class)))
				.thenAnswer((Answer<ApplicationInstance>) invocation -> invocation.getArgument(0));

		this.service.updateHealthStatusForApplicationInstance("a-1", Status.UP);

		verify(this.repository).save(this.applicationInstanceArgumentCaptor.capture());
		ApplicationInstance applicationInstance = this.applicationInstanceArgumentCaptor.getValue();
		assertThat(applicationInstance.getId()).isEqualTo("a-1");
	}

}
