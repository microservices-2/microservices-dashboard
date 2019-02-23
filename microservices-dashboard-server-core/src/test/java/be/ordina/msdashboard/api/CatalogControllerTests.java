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

package be.ordina.msdashboard.api;

import java.util.Collections;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceMother;
import be.ordina.msdashboard.catalog.Catalog;
import be.ordina.msdashboard.catalog.CatalogMother;
import be.ordina.msdashboard.catalog.CatalogService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.verify;
import static org.mockito.BDDMockito.when;
import static org.mockito.Mockito.verifyNoMoreInteractions;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class CatalogControllerTests {

	@Mock
	private CatalogService catalogService;

	@InjectMocks
	private CatalogController catalogController;

	@Test
	public void emptyCatalogShouldReturnEmptyResponse() {
		when(this.catalogService.getCatalog()).thenReturn(CatalogMother.emptyCatalog());

		CatalogResource catalogResource = this.catalogController.getCatalog();

		verify(this.catalogService).getCatalog();
		verifyNoMoreInteractions(this.catalogService);

		assertThat(catalogResource).isNotNull();
		assertThat(catalogResource.getApplicationInstances()).isEmpty();
	}

	@Test
	public void catalogWithEntriesShouldReturnCorrespondingResponse() {
		ApplicationInstance applicationInstance = ApplicationInstanceMother.instance("a-1", "a");
		Catalog catalog = CatalogMother.catalogWith(Collections.singletonList(applicationInstance));
		when(this.catalogService.getCatalog()).thenReturn(catalog);

		CatalogResource catalogResource = this.catalogController.getCatalog();

		verify(this.catalogService).getCatalog();
		verifyNoMoreInteractions(this.catalogService);

		assertThat(catalogResource).isNotNull();
		assertThat(catalogResource.getApplicationInstances()).isNotEmpty();
	}

}
