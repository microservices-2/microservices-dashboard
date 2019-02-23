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

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceSupport;

/**
 * Resource that represents the catalog.
 *
 * @author Tim Ysewyn
 */
class CatalogResource extends ResourceSupport {

	private final List<Resource<String>> applicationInstanceResources;

	CatalogResource(List<Resource<String>> applicationInstanceResources) {
		this.applicationInstanceResources = applicationInstanceResources;
	}

	@JsonProperty("application-instances")
	List<Resource<String>> getApplicationInstances() {
		return this.applicationInstanceResources;
	}
}
