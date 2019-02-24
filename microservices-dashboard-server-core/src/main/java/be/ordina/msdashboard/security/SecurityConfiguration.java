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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientPropertiesRegistrationAdapter;
import org.springframework.boot.autoconfigure.security.oauth2.client.reactive.ReactiveOAuth2ClientAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.InMemoryReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.oauth2.client.web.server.UnAuthenticatedServerOAuth2AuthorizedClientRepository;
import org.springframework.web.reactive.function.client.ExchangeFilterFunctions;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Class that contains all security related configuration.
 *
 * @author Tim Ysewyn
 */
@Configuration
@EnableConfigurationProperties({ OAuth2ClientProperties.class, SecurityProperties.class })
@Import(ReactiveOAuth2ClientAutoConfiguration.class)
public class SecurityConfiguration {

	private static final String CLIENT_NAME = "ms-dashboard";

	@Autowired
	private SecurityProperties securityProperties;

	@Autowired
	private OAuth2ClientProperties oauth2ClientProperties;

	@Bean("machine-to-machine-web-client")
	public WebClient m2mWebClient() {
		return WebClient.builder()
				.apply(this::applyBasicFilter)
				.apply(this::applyOAuthFilter)
				.build();
	}

	private void applyOAuthFilter(WebClient.Builder builder) {
		if (!this.oauth2ClientProperties.getRegistration().containsKey(CLIENT_NAME)) {
			return;
		}

		ServerOAuth2AuthorizedClientExchangeFilterFunction oauthFilter =
				new ServerOAuth2AuthorizedClientExchangeFilterFunction(
						clientRegistrationRepository(this.oauth2ClientProperties),
						new UnAuthenticatedServerOAuth2AuthorizedClientRepository());
		oauthFilter.setDefaultClientRegistrationId(CLIENT_NAME);
		builder.filter(oauthFilter);
	}

	private ReactiveClientRegistrationRepository clientRegistrationRepository(OAuth2ClientProperties properties) {
		List<ClientRegistration> registrations = new ArrayList<>(
				OAuth2ClientPropertiesRegistrationAdapter
						.getClientRegistrations(properties).values());
		return new InMemoryReactiveClientRegistrationRepository(registrations);
	}

	private void applyBasicFilter(WebClient.Builder builder) {
		SecurityProperties.Client client = this.securityProperties.getClient();
		if (client.isBasicConfigured()) {
			builder.filter(ExchangeFilterFunctions.basicAuthentication(
					client.getBasic().getUsername(), client.getBasic().getPassword()));
		}
	}
}
