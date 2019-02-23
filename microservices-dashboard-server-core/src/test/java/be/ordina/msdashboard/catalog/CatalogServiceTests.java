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

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceMother;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author Tim Ysewyn
 */
public class CatalogServiceTests {

	@Test
	public void shouldReturnEmptyListOfApplicationsForEmptyCatalog() {
		CatalogService catalogService = new CatalogService();
		Catalog catalog = catalogService.getCatalog();
		assertThat(catalog.getApplications()).isEmpty();
	}

	@Test
	public void shouldReturnEmptyListOfApplicationInstancesForEmptyCatalog() {
		CatalogService catalogService = new CatalogService();
		Catalog catalog = catalogService.getCatalog();
		assertThat(catalog.getApplicationInstances()).isEmpty();
	}

	@Test
	public void shouldAddApplicationToEmptyCatalog() {
		CatalogService catalogService = new CatalogService();
		catalogService.addApplicationToCatalog("a");
		Catalog catalog = catalogService.getCatalog();
		assertThat(catalog.getApplications()).hasSize(1);
		assertThat(catalog.getApplications()).contains("a");
	}

	@Test
	public void shouldNotAddKnownApplicationToCatalog() {
		CatalogService catalogService = new CatalogService();
		catalogService.addApplicationToCatalog("a");
		catalogService.addApplicationToCatalog("a");
		Catalog catalog = catalogService.getCatalog();
		assertThat(catalog.getApplications()).hasSize(1);
		assertThat(catalog.getApplications()).contains("a");
	}

	@Test
	public void shouldRemoveKnownApplicationFromCatalog() {
		CatalogService catalogService = new CatalogService();
		catalogService.addApplicationToCatalog("a");
		catalogService.removeApplicationFromCatalog("a");
		Catalog catalog = catalogService.getCatalog();
		assertThat(catalog.getApplications()).isEmpty();
	}

	@Test
	public void shouldAddApplicationAndInstanceToEmptyCatalog() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1", "a");
		CatalogService catalogService = new CatalogService();
		catalogService.addApplicationInstanceToCatalog(applicationInstance);
		Catalog catalog = catalogService.getCatalog();
		assertThat(catalog.getApplications()).hasSize(1);
		assertThat(catalog.getApplications()).contains("a");
		assertThat(catalog.getApplicationInstances()).hasSize(1);
		assertThat(catalog.getApplicationInstancesForApplication("a")).hasSize(1);
		assertThat(catalog.getApplicationInstancesForApplication("a")).contains("a-1");
	}

	@Test
	public void shouldRemoveApplicationAndInstanceFromCatalog() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1", "a");
		CatalogService catalogService = new CatalogService();
		catalogService.addApplicationInstanceToCatalog(applicationInstance);
		catalogService.removeApplicationInstanceFromCatalog(applicationInstance);
		Catalog catalog = catalogService.getCatalog();
		assertThat(catalog.getApplications()).hasSize(1);
		assertThat(catalog.getApplications()).contains("a");
		assertThat(catalog.getApplicationInstances()).hasSize(0);
		assertThat(catalog.getApplicationInstancesForApplication("a")).hasSize(0);
	}

}
