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

import be.ordina.msdashboard.applicationinstance.ApplicationInstanceService;

import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for the catalog.
 *
 * @author Tim Ysewyn
 */
@Configuration
public class CatalogConfiguration {

	@Bean
	LandscapeWatcher landscapeWatcher(DiscoveryClient discoveryClient, CatalogService catalogService,
			ApplicationInstanceService applicationInstanceService,
			List<LandscapeWatcher.ApplicationFilter> applicationFilters,
			List<LandscapeWatcher.ApplicationInstanceFilter> applicationInstanceFilters) {
		return new LandscapeWatcher(discoveryClient, catalogService,
				applicationInstanceService, applicationFilters, applicationInstanceFilters);
	}

	@Bean
	public CatalogService catalogService() {
		return new CatalogService();
	}

}
