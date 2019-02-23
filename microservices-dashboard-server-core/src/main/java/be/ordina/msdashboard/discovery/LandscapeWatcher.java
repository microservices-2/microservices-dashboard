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

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import be.ordina.msdashboard.catalog.Catalog;
import be.ordina.msdashboard.catalog.CatalogService;
import be.ordina.msdashboard.discovery.events.ServiceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceDiscovered;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceInstanceDiscovered;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.discovery.event.HeartbeatEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;

import static org.apache.commons.collections4.CollectionUtils.subtract;

/**
 * Watcher that will update the catalog with the latest discovered applications and their instances.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
class LandscapeWatcher {

	private static final Logger logger = LoggerFactory.getLogger(LandscapeWatcher.class);

	private final DiscoveryClient discoveryClient;
	private final CatalogService catalogService;
	private final ApplicationFilters applicationFilters;
	private final ApplicationInstanceFilters applicationInstanceFilters;
	private final ApplicationEventPublisher publisher;

	LandscapeWatcher(DiscoveryClient discoveryClient, CatalogService catalogService,
			List<ApplicationFilter> applicationFilters,
			List<ApplicationInstanceFilter> applicationInstanceFilters,
			ApplicationEventPublisher publisher) {
		this.discoveryClient = discoveryClient;
		this.catalogService = catalogService;
		this.applicationFilters = new ApplicationFilters(applicationFilters);
		this.applicationInstanceFilters = new ApplicationInstanceFilters(applicationInstanceFilters);
		this.publisher = publisher;
	}

	@EventListener({ HeartbeatEvent.class })
	public void discoverLandscape() {
		logger.debug("Discovering landscape");

		List<String> applications = this.discoveryClient.getServices()
				.stream()
				.filter(this.applicationFilters)
				.collect(Collectors.toList());

		Catalog catalog = this.catalogService.getCatalog();
		dispatchEventForDiscoveredApplications(applications, catalog);
		dispatchEventForDisappearedApplications(applications, catalog);

		applications.forEach(this::processApplication);
	}

	private void dispatchEventForDiscoveredApplications(List<String> applications, Catalog catalog) {
		subtract(applications, catalog.getApplications())
				.stream()
				.map(ServiceDiscovered::new)
				.forEach(this.publisher::publishEvent);
	}

	private void dispatchEventForDisappearedApplications(List<String> applications, Catalog catalog) {
		subtract(catalog.getApplications(), applications)
				.stream()
				.map(ServiceDisappeared::new)
				.forEach(this.publisher::publishEvent);
	}

	private void processApplication(String application) {
		logger.debug("Processing application {}", application);

		List<ServiceInstance> instances = this.discoveryClient.getInstances(application)
				.stream()
				.filter(this.applicationInstanceFilters)
				.collect(Collectors.toList());

		Catalog catalog = this.catalogService.getCatalog();
		List<String> knownInstanceIds = catalog.getApplicationInstancesForApplication(application);
		dispatchEventForDiscoveredApplicationInstances(instances, knownInstanceIds);
		dispatchEventForDisappearedApplicationInstances(instances, knownInstanceIds);
	}

	private void dispatchEventForDiscoveredApplicationInstances(List<ServiceInstance> discoveredInstances, List<String> knownInstanceIds) {
		discoveredInstances.stream()
				.filter(instance -> !knownInstanceIds.contains(instance.getInstanceId()))
				.map(ServiceInstanceDiscovered::new)
				.forEach(this.publisher::publishEvent);
	}

	private void dispatchEventForDisappearedApplicationInstances(List<ServiceInstance> discoveredInstances, List<String> knownInstanceIds) {
		List<String> discoveredInstanceIds = discoveredInstances.stream()
				.map(ServiceInstance::getInstanceId)
				.collect(Collectors.toList());
		knownInstanceIds.stream()
				.filter(instanceId -> !discoveredInstanceIds.contains(instanceId))
				.map(ServiceInstanceDisappeared::new)
				.forEach(this.publisher::publishEvent);
	}

	private class ApplicationFilters implements ApplicationFilter {

		private final List<ApplicationFilter> filters;

		ApplicationFilters(List<ApplicationFilter> filters) {
			this.filters = filters;
		}

		@Override
		public boolean test(String s) {
			if (this.filters.isEmpty()) {
				return true;
			}
			for (ApplicationFilter filter : this.filters) {
				if (filter.test(s)) {
					return true;
				}
			}
			return false;
		}
	}

	private class ApplicationInstanceFilters implements ApplicationInstanceFilter {

		private final List<ApplicationInstanceFilter> filters;

		ApplicationInstanceFilters(List<ApplicationInstanceFilter> filters) {
			this.filters = filters;
		}

		@Override
		public boolean test(ServiceInstance s) {
			if (this.filters.isEmpty()) {
				return true;
			}
			for (ApplicationInstanceFilter filter : this.filters) {
				if (filter.test(s)) {
					return true;
				}
			}
			return false;
		}
	}

}
