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

package be.ordina.msdashboard.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

/**
 * Microservices Dashboard Server security properties.
 *
 * @author Tim Ysewyn
 */
@ConfigurationProperties("ms-dashboard.security")
public class SecurityProperties {

	private Client client = new Client();

	public Client getClient() {
		return this.client;
	}

	public void setClient(Client client) {
		this.client = client;
	}

	/**
	 * Security properties for outgoing HTTP calls.
	 */
	public static class Client {

		@NestedConfigurationProperty
		private BasicClientSecurityProperties basic = new BasicClientSecurityProperties();

		public BasicClientSecurityProperties getBasic() {
			return this.basic;
		}

		public void setBasic(BasicClientSecurityProperties basic) {
			this.basic = basic;
		}

		public boolean isBasicConfigured() {
			return this.basic.isConfigured();
		}
	}
}
