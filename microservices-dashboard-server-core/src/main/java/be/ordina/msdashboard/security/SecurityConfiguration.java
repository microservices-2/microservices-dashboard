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

import java.util.ArrayList;
import java.util.List;

import be.ordina.msdashboard.configuration.MachineToMachineWebClientConfigurer;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.security.oauth2.client.ClientsConfiguredCondition;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientPropertiesRegistrationAdapter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.InMemoryReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.oauth2.client.web.server.UnAuthenticatedServerOAuth2AuthorizedClientRepository;
import org.springframework.web.reactive.function.client.ExchangeFilterFunctions;

/**
 * Class that contains all security related configuration.
 *
 * @author Tim Ysewyn
 */
@Configuration
@EnableConfigurationProperties({ BasicClientSecurityProperties.class, OAuth2ClientProperties.class })
public class SecurityConfiguration {

	private static final String CLIENT_NAME = "ms-dashboard-m2m";

	@Bean("ms-dashboard-m2m-basic-filter")
	@Conditional(BasicClientSecurityConfigured.class)
	MachineToMachineWebClientConfigurer basicFilter(BasicClientSecurityProperties properties) {
		return builder -> builder.filter(ExchangeFilterFunctions.basicAuthentication(
				properties.getUsername(), properties.getPassword()));
	}

	@Bean("ms-dashboard-m2m-oauth-filter")
	@Conditional(ClientsConfiguredCondition.class)
	MachineToMachineWebClientConfigurer oauthFilter(
			ReactiveClientRegistrationRepository reactiveClientRegistrationRepository) {
		return builder -> {
			ServerOAuth2AuthorizedClientExchangeFilterFunction oauthFilter =
					new ServerOAuth2AuthorizedClientExchangeFilterFunction(
							reactiveClientRegistrationRepository,
							new UnAuthenticatedServerOAuth2AuthorizedClientRepository());
			oauthFilter.setDefaultClientRegistrationId(CLIENT_NAME);
			builder.filter(oauthFilter);
		};
	}

	@Bean
	@ConditionalOnMissingBean
	@Conditional(ClientsConfiguredCondition.class)
	public ReactiveClientRegistrationRepository clientRegistrationRepository(OAuth2ClientProperties properties) {
		List<ClientRegistration> registrations = new ArrayList<>(
				OAuth2ClientPropertiesRegistrationAdapter
						.getClientRegistrations(properties).values());
		return new InMemoryReactiveClientRegistrationRepository(registrations);
	}

}
