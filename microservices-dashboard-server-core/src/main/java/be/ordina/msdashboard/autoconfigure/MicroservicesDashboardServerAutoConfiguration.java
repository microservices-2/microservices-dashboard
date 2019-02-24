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

package be.ordina.msdashboard.autoconfigure;

import be.ordina.msdashboard.applicationinstance.ApplicationInstanceConfiguration;
import be.ordina.msdashboard.catalog.CatalogConfiguration;
import be.ordina.msdashboard.discovery.DiscoveryConfiguration;
import be.ordina.msdashboard.eventstore.InMemoryEventStoreConfiguration;
import be.ordina.msdashboard.security.SecurityConfiguration;

import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.cloud.client.discovery.composite.CompositeDiscoveryClientAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Auto-configuration for the microservices dashboard server.
 *
 * @author Tim Ysewyn
 */
@Configuration
@AutoConfigureAfter({ CompositeDiscoveryClientAutoConfiguration.class })
@EnableAsync
@EnableScheduling
@Import({ApplicationInstanceConfiguration.class, CatalogConfiguration.class,
		DiscoveryConfiguration.class, InMemoryEventStoreConfiguration.class,
		SecurityConfiguration.class})
public class MicroservicesDashboardServerAutoConfiguration {

}
