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

import be.ordina.msdashboard.applicationinstance.ApplicationInstanceMother;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author Tim Ysewyn
 */
public class CatalogServiceTests {

	@Test
	public void shouldReturnEmptyListOfApplicationsForEmptyCatalog() {
		CatalogService catalogService = new CatalogService();
		assertThat(catalogService.getApplications()).isEmpty();
	}

	@Test
	public void shouldReturnEmptyListOfApplicationInstancesForEmptyCatalog() {
		CatalogService catalogService = new CatalogService();
		assertThat(catalogService.getApplicationInstances()).isEmpty();
	}

	@Test
	public void shouldReturnUpdatedListOfApplicationsWhenListOfApplicationsIsUpdated() {
		CatalogService catalogService = new CatalogService();
		catalogService.updateListOfApplications(Arrays.asList("a", "b"));
		assertThat(catalogService.getApplications()).containsExactly("a", "b");
		catalogService.updateListOfApplications(Arrays.asList("b", "c"));
		assertThat(catalogService.getApplications()).containsExactly("b", "c");
	}

	@Test
	public void shouldReturnUpdatedListOfInstancesWhenListOfInstancesForAnApplicationsIsUpdated() {
		CatalogService catalogService = new CatalogService();
		catalogService.updateListOfInstancesForApplication("a",
				Collections.singletonList(ApplicationInstanceMother.instance("a-1")));
		assertThat(catalogService.getApplicationInstances()).containsExactly("a-1");
		catalogService.updateListOfInstancesForApplication("a",
				Collections.singletonList(ApplicationInstanceMother.instance("a-2")));
		assertThat(catalogService.getApplicationInstances()).containsExactly("a-2");
	}

}
