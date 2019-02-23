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

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;
import reactor.core.publisher.Mono;

import be.ordina.msdashboard.applicationinstance.commands.CreateApplicationInstance;
import be.ordina.msdashboard.applicationinstance.commands.DeleteApplicationInstance;
import be.ordina.msdashboard.applicationinstance.commands.UpdateApplicationInstanceHealth;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceDeleted;

import org.springframework.boot.actuate.health.Status;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Links;

import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.verify;
import static org.mockito.BDDMockito.when;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class ApplicationInstanceServiceTests {

	@Mock
	private ServiceInstance serviceInstance;

	@Mock
	private ApplicationInstanceRepository repository;

	@Mock
	private ActuatorEndpointsDiscovererService actuatorEndpointsDiscovererService;

	@InjectMocks
	private ApplicationInstanceService service;

	@Captor
	private ArgumentCaptor<ApplicationInstance> applicationInstanceArgumentCaptor;

	@Before
	public void setup() {
		when(this.actuatorEndpointsDiscovererService.findActuatorEndpoints(this.serviceInstance))
				.thenReturn(Mono.just(new Links()));
	}

	@Test
	public void shouldRetrieveApplicationInstanceFromRepository() {
		when(this.serviceInstance.getInstanceId()).thenReturn("a-1");
		when(this.repository.getById("a-1")).thenReturn(ApplicationInstanceMother.instance("a-1", "a"));

		Optional<String> applicationInstanceId = this.service.getApplicationInstanceIdForServiceInstance(this.serviceInstance);

		verify(this.repository).getById("a-1");
		assertThat(applicationInstanceId).isNotEmpty();
		assertThat(applicationInstanceId).get().isEqualTo("a-1");
	}

	@Test
	public void shouldCreateApplicationInstanceWithoutActuatorEndpointsAndSaveInRepository() {
		when(this.serviceInstance.getInstanceId()).thenReturn("a-1");
		when(this.serviceInstance.getUri()).thenReturn(URI.create("http://localhost:8080"));
		when(this.repository.save(any(ApplicationInstance.class)))
				.thenAnswer((Answer<ApplicationInstance>) invocation -> invocation.getArgument(0));

		CreateApplicationInstance command = new CreateApplicationInstance(this.serviceInstance);
		String applicationInstanceId = this.service.createApplicationInstance(command);

		assertThat(applicationInstanceId).isEqualTo("a-1");

		await().untilAsserted(() -> {
			verify(this.repository).save(this.applicationInstanceArgumentCaptor.capture());
			ApplicationInstance applicationInstance = this.applicationInstanceArgumentCaptor.getValue();
			assertThat(applicationInstance).isNotNull();
			assertThat(applicationInstance.getActuatorEndpoints()).isEmpty();
		});
	}

	@Test
	public void shouldCreateApplicationInstanceWithDiscoveredActuatorEndpointsAndSaveInRepository() {
		when(this.serviceInstance.getInstanceId()).thenReturn("a-1");
		when(this.serviceInstance.getUri()).thenReturn(URI.create("http://localhost:8080"));
		when(this.actuatorEndpointsDiscovererService.findActuatorEndpoints(this.serviceInstance))
				.thenReturn(Mono.just(new Links(new Link("http://localhost:8080/actuator/health", "health"))));
		when(this.repository.save(any(ApplicationInstance.class)))
				.thenAnswer((Answer<ApplicationInstance>) invocation -> invocation.getArgument(0));

		CreateApplicationInstance command = new CreateApplicationInstance(this.serviceInstance);
		String applicationInstanceId = this.service.createApplicationInstance(command);

		assertThat(applicationInstanceId).isEqualTo("a-1");

		await().untilAsserted(() -> {
			verify(this.repository).save(this.applicationInstanceArgumentCaptor.capture());
			ApplicationInstance applicationInstance = this.applicationInstanceArgumentCaptor.getValue();
			assertThat(applicationInstance).isNotNull();
			assertThat(applicationInstance.getActuatorEndpoints()).isNotEmpty();
			assertThat(applicationInstance.getActuatorEndpoints().hasLink("health")).isTrue();
			assertThat(applicationInstance.getActuatorEndpoints().getLink("health").getHref())
					.isEqualTo("http://localhost:8080/actuator/health");
		});
	}

	@Test
	public void shouldRetrieveAllApplicationInstancesFromRepository() {
		when(this.repository.getAll()).thenReturn(singletonList(ApplicationInstanceMother.instance("a-1", "a")));

		List<ApplicationInstance> applicationInstances = this.service.getApplicationInstances();

		verify(this.repository).getAll();
		assertThat(applicationInstances).isNotEmpty();
	}

	@Test
	public void shouldUpdateTheHealthOfAnApplicationInstance() {
		when(this.repository.getById("a-1")).thenReturn(ApplicationInstanceMother.instance("a-1", "a"));
		when(this.repository.save(any(ApplicationInstance.class)))
				.thenAnswer((Answer<ApplicationInstance>) invocation -> invocation.getArgument(0));

		UpdateApplicationInstanceHealth command = new UpdateApplicationInstanceHealth("a-1", Status.UP);
		this.service.updateApplicationInstanceHealth(command);

		verify(this.repository).save(this.applicationInstanceArgumentCaptor.capture());
		ApplicationInstance applicationInstance = this.applicationInstanceArgumentCaptor.getValue();
		assertThat(applicationInstance.getId()).isEqualTo("a-1");
	}

	@Test
	public void shouldDeleteApplicationInstanceAndSaveInRepository() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1", "a");
		applicationInstance.markChangesAsCommitted();
		when(this.repository.getById("a-1")).thenReturn(applicationInstance);

		DeleteApplicationInstance command = new DeleteApplicationInstance("a-1");
		this.service.deleteApplicationInstance(command);

		verify(this.repository).save(this.applicationInstanceArgumentCaptor.capture());
		ApplicationInstance applicationInstanceToBeSaved = this.applicationInstanceArgumentCaptor.getValue();
		assertThat(applicationInstanceToBeSaved.getId()).isEqualTo("a-1");
		assertThat(applicationInstanceToBeSaved.getUncommittedChanges()).hasSize(1);
		assertThat(applicationInstanceToBeSaved.getUncommittedChanges().get(0))
				.isInstanceOf(ApplicationInstanceDeleted.class);
	}

}
