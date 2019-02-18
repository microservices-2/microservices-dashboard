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

import java.util.List;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;

/**
 * Application service to interact with the catalog.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
public class CatalogService {

	private final Catalog catalog;

	public CatalogService() {
		this.catalog = new Catalog();
	}

	public List<String> updateListOfApplications(List<String> applications) {
		return this.catalog.updateListOfApplications(applications);
	}

	public void updateListOfInstancesForApplication(String application, List<ApplicationInstance> applicationInstances) {
		this.catalog.updateListOfInstancesForApplication(application, applicationInstances);
	}
}
