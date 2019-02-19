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

import java.util.Arrays;
import java.util.Collections;
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

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceMother;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceService;
import be.ordina.msdashboard.catalog.CatalogService;
import be.ordina.msdashboard.catalog.LandscapeWatcher;

import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.verify;
import static org.mockito.BDDMockito.when;

/**
 * Landscape Watcher Test.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
@RunWith(MockitoJUnitRunner.class)
public class LandscapeWatcherTest {

	@Mock
	private DiscoveryClient discoveryClient;

	@Mock
	private CatalogService catalogService;

	@Mock
	private ApplicationInstanceService applicationInstanceService;

	@InjectMocks
	private LandscapeWatcher landscapeWatcher;

	@Captor
	private ArgumentCaptor<List<String>> applicationsArgumentCaptor;

	@Captor
	private ArgumentCaptor<ServiceInstance> serviceInstanceArgumentCaptor;

	@Captor
	private ArgumentCaptor<List<ApplicationInstance>> applicationInstancesArgumentCaptor;

	@Test
	public void shouldAddNewApplicationInstanceToCatalogAtStartup() {
		when(this.discoveryClient.getServices()).thenReturn(Arrays.asList("a"));
		when(this.catalogService.updateListOfApplications(anyList())).thenAnswer((Answer<List<String>>) invocation -> invocation.getArgument(0));
		when(this.discoveryClient.getInstances("a")).thenReturn(Collections.singletonList(new DefaultServiceInstance("a1", "a", "host", 8080, false)));
		when(this.applicationInstanceService.getApplicationInstanceForServiceInstance(any(ServiceInstance.class)))
				.thenReturn(Optional.empty());
		ApplicationInstance returnedApplicationInstance = ApplicationInstanceMother.instance();
		when(this.applicationInstanceService.createApplicationInstanceForServiceInstance(any(ServiceInstance.class)))
				.thenReturn(returnedApplicationInstance);

		this.landscapeWatcher.discoverLandscape();

		verify(this.discoveryClient).getServices();
		verify(this.catalogService).updateListOfApplications(this.applicationsArgumentCaptor.capture());
		List<String> foundApplications = this.applicationsArgumentCaptor.getValue();
		assertThat(foundApplications).containsExactly("a");

		verify(this.discoveryClient).getInstances("a");

		verify(this.applicationInstanceService).getApplicationInstanceForServiceInstance(this.serviceInstanceArgumentCaptor.capture());
		ServiceInstance serviceInstance = this.serviceInstanceArgumentCaptor.getValue();

		verify(this.applicationInstanceService).createApplicationInstanceForServiceInstance(this.serviceInstanceArgumentCaptor.capture());
		serviceInstance = this.serviceInstanceArgumentCaptor.getValue();

		verify(this.catalogService).updateListOfInstancesForApplication(eq("a"), this.applicationInstancesArgumentCaptor.capture());
		List<ApplicationInstance> applicationInstances = this.applicationInstancesArgumentCaptor.getValue();
		assertThat(applicationInstances).hasSize(1);
		assertThat(applicationInstances).extracting(ApplicationInstance::hashCode).contains(returnedApplicationInstance.hashCode());
	}

}
