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

package be.ordina.msdashboard.discovery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import be.ordina.msdashboard.catalog.Catalog;
import be.ordina.msdashboard.catalog.CatalogService;
import be.ordina.msdashboard.discovery.events.ServiceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceDiscovered;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDiscovered;

import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.verify;
import static org.mockito.BDDMockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.verifyZeroInteractions;

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
	private Catalog catalog;

	@Mock
	private ApplicationEventPublisher publisher;

	@Captor
	private ArgumentCaptor<ApplicationEvent> applicationEventArgumentCaptor;

	private LandscapeWatcher landscapeWatcher;
	private List<ApplicationFilter> applicationFilters = new ArrayList<>();
	private List<ApplicationInstanceFilter> applicationInstanceFilters = new ArrayList<>();

	@Before
	public void setupTest() {
		when(this.catalogService.getCatalog()).thenReturn(this.catalog);

		this.landscapeWatcher = new LandscapeWatcher(this.discoveryClient, this.catalogService,
				this.applicationFilters, this.applicationInstanceFilters, this.publisher);
	}

	@After
	public void verifyTest() {
		verifyNoMoreInteractions(this.discoveryClient);

		this.applicationFilters.clear();
		this.applicationInstanceFilters.clear();
	}

	@Test
	public void shouldDispatchDiscoveredEventsOnFirstHeartbeatEvent() {
		when(this.discoveryClient.getServices()).thenReturn(Collections.singletonList("a"));
		ServiceInstance serviceInstance = new DefaultServiceInstance("a-1", "a", "host", 8080, false);
		when(this.discoveryClient.getInstances("a")).thenReturn(Collections.singletonList(serviceInstance));

		this.landscapeWatcher.discoverLandscape();

		verify(this.catalogService, times(2)).getCatalog();
		verifyNoMoreInteractions(this.catalogService);

		verify(this.discoveryClient).getServices();
		verify(this.discoveryClient).getInstances("a");
		verifyNoMoreInteractions(this.discoveryClient);

		verify(this.publisher, times(2)).publishEvent(this.applicationEventArgumentCaptor.capture());
		verifyNoMoreInteractions(this.publisher);
		List<ApplicationEvent> applicationEvents = this.applicationEventArgumentCaptor.getAllValues();

		ApplicationEvent event = applicationEvents.get(0);
		assertThat(event).isInstanceOfSatisfying(ServiceDiscovered.class,
				e -> assertThat(e.getSource()).isEqualTo("a"));

		event = applicationEvents.get(1);
		assertThat(event).isInstanceOfSatisfying(ServiceInstanceDiscovered.class,
				e -> assertThat(e.getSource()).isEqualTo(serviceInstance));
	}

	@Test
	public void shouldSkipFilteredApplications() {
		this.applicationFilters.add("a"::equalsIgnoreCase);
		when(this.discoveryClient.getServices()).thenReturn(Arrays.asList("a", "b"));
		when(this.catalog.getApplications()).thenReturn(Arrays.asList("a"));

		this.landscapeWatcher.discoverLandscape();

		verify(this.discoveryClient).getServices();
		verify(this.discoveryClient).getInstances("a");
		verifyNoMoreInteractions(this.discoveryClient);
		verifyZeroInteractions(this.publisher);
	}

	@Test
	public void shouldSkipFilteredApplicationInstances() {
		this.applicationInstanceFilters.add(serviceInstance -> "a-1".equalsIgnoreCase(serviceInstance.getInstanceId()));
		when(this.discoveryClient.getServices()).thenReturn(Collections.singletonList("a"));
		when(this.discoveryClient.getInstances("a")).thenReturn(
				Arrays.asList(new DefaultServiceInstance("a-1", "a", "host", 8080, false),
						new DefaultServiceInstance("a-2", "a", "host", 8080, false)));
		when(this.catalog.getApplicationInstancesForApplication("a")).thenReturn(Collections.singletonList("a-1"));

		this.landscapeWatcher.discoverLandscape();

		verify(this.discoveryClient).getServices();
		verify(this.discoveryClient).getInstances("a");

		verify(this.publisher).publishEvent(this.applicationEventArgumentCaptor.capture());
		verifyZeroInteractions(this.publisher);
	}

	@Test
	public void shouldDispatchEventWhenServiceDisappeared() {
		when(this.discoveryClient.getServices()).thenReturn(Collections.singletonList("a"));
		when(this.catalog.getApplications()).thenReturn(Arrays.asList("a", "b"));
		when(this.discoveryClient.getInstances("a")).thenReturn(Collections.emptyList());

		this.landscapeWatcher.discoverLandscape();

		verify(this.catalogService, times(2)).getCatalog();
		verifyNoMoreInteractions(this.catalogService);

		verify(this.discoveryClient).getServices();
		verify(this.discoveryClient).getInstances("a");
		verifyNoMoreInteractions(this.discoveryClient);

		verify(this.publisher).publishEvent(this.applicationEventArgumentCaptor.capture());
		verifyNoMoreInteractions(this.publisher);
		ApplicationEvent event = this.applicationEventArgumentCaptor.getValue();
		assertThat(event).isInstanceOfSatisfying(ServiceDisappeared.class,
				e -> assertThat(e.getSource()).isEqualTo("b"));
	}

	@Test
	public void shouldDispatchEventWhenServiceInstanceDisappeared() {
		when(this.discoveryClient.getServices()).thenReturn(Collections.singletonList("a"));
		when(this.catalog.getApplications()).thenReturn(Collections.singletonList("a"));
		ServiceInstance serviceInstance = new DefaultServiceInstance("a-1", "a", "host", 8080, false);
		when(this.discoveryClient.getInstances("a")).thenReturn(Collections.singletonList(serviceInstance));
		when(this.catalog.getApplicationInstancesForApplication("a")).thenReturn(Arrays.asList("a-1", "a-2"));

		this.landscapeWatcher.discoverLandscape();

		verify(this.catalogService, times(2)).getCatalog();
		verifyNoMoreInteractions(this.catalogService);

		verify(this.discoveryClient).getServices();
		verify(this.discoveryClient).getInstances("a");
		verifyNoMoreInteractions(this.discoveryClient);

		verify(this.publisher).publishEvent(this.applicationEventArgumentCaptor.capture());
		verifyNoMoreInteractions(this.publisher);
		ApplicationEvent event = this.applicationEventArgumentCaptor.getValue();
		assertThat(event).isInstanceOfSatisfying(ServiceInstanceDisappeared.class,
				e -> assertThat(e.getSource()).isEqualTo("a-2"));
	}

}
