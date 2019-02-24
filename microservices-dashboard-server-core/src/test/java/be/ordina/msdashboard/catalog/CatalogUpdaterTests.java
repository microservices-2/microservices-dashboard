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

package be.ordina.msdashboard.catalog;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceEventMother;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceDeleted;
import be.ordina.msdashboard.discovery.ServiceDiscoveryEventMother;
import be.ordina.msdashboard.discovery.events.ServiceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceDiscovered;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class CatalogUpdaterTests {

	@Mock
	private CatalogService catalogService;

	@InjectMocks
	private CatalogUpdater catalogUpdater;

	@Captor
	private ArgumentCaptor<ApplicationInstance> applicationInstanceArgumentCaptor;

	@Test
	public void applicationShouldBeAddedToCatalogWhenNewServiceIsDiscovered() {
		ServiceDiscovered event = ServiceDiscoveryEventMother.newServiceDiscovered("a");
		this.catalogUpdater.addNewApplicationToCatalog(event);
		verify(this.catalogService).addApplicationToCatalog("a");
	}

	@Test
	public void applicationShouldBeRemovedFromCatalogWhenServiceHasDisappeared() {
		ServiceDisappeared event = ServiceDiscoveryEventMother.serviceDisappeared("a");
		this.catalogUpdater.removeApplicationFromCatalog(event);
		verify(this.catalogService).removeApplicationFromCatalog("a");
	}

	@Test
	public void applicationInstanceShouldBeAddedToCatalogWhenApplicationInstanceIsCreated() {
		ApplicationInstanceCreated event = ApplicationInstanceEventMother.applicationInstanceCreated("a-1", "a");
		this.catalogUpdater.addNewApplicationInstanceToCatalog(event);
		verify(this.catalogService).addApplicationInstanceToCatalog(this.applicationInstanceArgumentCaptor.capture());
		ApplicationInstance applicationInstance = this.applicationInstanceArgumentCaptor.getValue();
		assertThat(applicationInstance).isNotNull();
		assertThat(applicationInstance.getId()).isEqualTo("a-1");
	}

	@Test
	public void applicationInstanceShouldBeRemovedFromCatalogWhenApplicationInstanceIsDeleted() {
		ApplicationInstanceDeleted event = ApplicationInstanceEventMother.applicationInstanceDeleted("a-1", "a");
		this.catalogUpdater.removeApplicationInstanceFromCatalog(event);
		verify(this.catalogService).removeApplicationInstanceFromCatalog(this.applicationInstanceArgumentCaptor.capture());
		ApplicationInstance applicationInstance = this.applicationInstanceArgumentCaptor.getValue();
		assertThat(applicationInstance).isNotNull();
		assertThat(applicationInstance.getId()).isEqualTo("a-1");
	}

}
