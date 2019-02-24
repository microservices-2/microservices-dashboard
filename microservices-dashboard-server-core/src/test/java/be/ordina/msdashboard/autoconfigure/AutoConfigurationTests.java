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

import org.junit.Test;

import be.ordina.msdashboard.applicationinstance.ApplicationInstanceHealthWatcher;

import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.cloud.client.discovery.composite.CompositeDiscoveryClientAutoConfiguration;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author Tim Ysewyn
 */
public class AutoConfigurationTests {

	private ApplicationContextRunner contextRunner = new ApplicationContextRunner()
			.withConfiguration(AutoConfigurations.of(
					MicroservicesDashboardServerAutoConfiguration.class,
					CompositeDiscoveryClientAutoConfiguration.class));

	@Test
	public void shouldLoadContext() {
		this.contextRunner.run(context -> {
			assertThat(context.getBean(ApplicationInstanceHealthWatcher.class)).isNotNull();
		});
	}

}
