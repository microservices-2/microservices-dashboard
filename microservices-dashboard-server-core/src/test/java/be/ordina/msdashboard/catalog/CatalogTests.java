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

import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author Tim Ysewyn
 */
public class CatalogTests {

	@Test
	public void newCatalogShouldReturnEmptyListOfApplications() {
		Catalog catalog = new Catalog();
		assertThat(catalog.getApplications()).isEmpty();
	}

	@Test
	public void newCatalogShouldReturnEmptyListOfApplicationInstances() {
		Catalog catalog = new Catalog();
		assertThat(catalog.getApplicationInstances()).isEmpty();
	}

	@Test
	public void catalogShouldReturnListOfApplicationsAfterBeingUpdated() {
		Catalog catalog = new Catalog();
		catalog.updateListOfApplications(Arrays.asList("a", "b"));
		assertThat(catalog.getApplications()).containsExactly("a", "b");
		catalog.updateListOfApplications(Arrays.asList("b", "c"));
		assertThat(catalog.getApplications()).containsExactly("b", "c");
	}

	@Test
	public void applicationShouldOnlyAppearOnceInTheList() {
		Catalog catalog = new Catalog();
		catalog.updateListOfApplications(Arrays.asList("a", "a"));
		assertThat(catalog.getApplications()).hasSize(1);
	}

	@Test
	public void unknownApplicationShouldBeAddedWhenListOfInstancesIsUpdated() {
		Catalog catalog = new Catalog();
		catalog.updateListOfInstancesForApplication("a", Collections.singletonList("a-1"));
		assertThat(catalog.getApplications()).hasSize(1);
	}

	@Test
	public void catalogShouldReturnEmptyListOfInstancesForUnknownApplication() {
		Catalog catalog = new Catalog();
		assertThat(catalog.getApplicationInstancesForApplication("a")).isEmpty();
	}

	@Test
	public void catalogShouldReturnListOfInstancesForKnownApplication() {
		Catalog catalog = new Catalog();
		catalog.updateListOfInstancesForApplication("a", Collections.singletonList("a-1"));
		assertThat(catalog.getApplicationInstancesForApplication("a")).isNotEmpty();
	}

	@Test
	public void catalogShouldReturnListOfInstancesWhenListOfInstancesIsUpdated() {
		Catalog catalog = new Catalog();
		catalog.updateListOfInstancesForApplication("a", Collections.singletonList("a-1"));
		assertThat(catalog.getApplicationInstances()).isNotEmpty();
	}

	@Test
	public void catalogShouldReturnUpdatedListOfInstancesWhenListOfInstancesForAnApplicationIsUpdated() {
		Catalog catalog = new Catalog();
		catalog.updateListOfInstancesForApplication("a", Collections.singletonList("a-1"));
		assertThat(catalog.getApplicationInstances()).containsExactly("a-1");
		catalog.updateListOfInstancesForApplication("a", Collections.singletonList("a-2"));
		assertThat(catalog.getApplicationInstances()).containsExactly("a-2");
	}

}
