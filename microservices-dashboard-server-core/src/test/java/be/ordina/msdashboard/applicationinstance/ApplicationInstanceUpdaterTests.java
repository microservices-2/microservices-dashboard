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

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import be.ordina.msdashboard.applicationinstance.commands.CreateApplicationInstance;
import be.ordina.msdashboard.applicationinstance.commands.DeleteApplicationInstance;
import be.ordina.msdashboard.discovery.ServiceDiscoveryEventMother;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDiscovered;

import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.ServiceInstance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class ApplicationInstanceUpdaterTests {

	@Mock
	private ApplicationInstanceService applicationInstanceService;

	@InjectMocks
	private ApplicationInstanceUpdater applicationInstanceUpdater;

	@Test
	public void applicationInstanceShouldBeAddedToCatalogWhenNewServiceInstanceIsDiscovered() {
		ServiceInstance discoveredServiceInstance = new DefaultServiceInstance("a-1", "a", "host", 8080, false);
		ServiceInstanceDiscovered event = ServiceDiscoveryEventMother.newServiceInstanceDiscovered(discoveredServiceInstance);
		this.applicationInstanceUpdater.createNewApplicationInstance(event);
		ArgumentCaptor<CreateApplicationInstance> captor = ArgumentCaptor.forClass(CreateApplicationInstance.class);
		verify(this.applicationInstanceService).createApplicationInstance(captor.capture());
		CreateApplicationInstance command = captor.getValue();
		assertThat(command.getServiceInstance()).isEqualTo(discoveredServiceInstance);
		verifyNoMoreInteractions(this.applicationInstanceService);
	}

	@Test
	public void applicationInstanceShouldBeRemovedFromCatalogWhenServiceInstanceHasDisappeared() {
		ServiceInstanceDisappeared event = ServiceDiscoveryEventMother.serviceInstanceDisappeared("a-1");
		this.applicationInstanceUpdater.deleteApplicationInstance(event);
		ArgumentCaptor<DeleteApplicationInstance> captor = ArgumentCaptor.forClass(DeleteApplicationInstance.class);
		verify(this.applicationInstanceService).deleteApplicationInstance(captor.capture());
		DeleteApplicationInstance command = captor.getValue();
		assertThat(command.getId()).isEqualTo("a-1");
		verifyNoMoreInteractions(this.applicationInstanceService);
	}

}
