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

package be.ordina.msdashboard.configuration;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.ExchangeFilterFunctions;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Contains common configuration for the microservices dashboard server.
 *
 * @author Tim Ysewyn
 */
@Configuration
public class CommonConfiguration {

	@Bean("machine-to-machine-web-client")
	public WebClient m2mWebClient(List<MachineToMachineWebClientConfigurer> configurers) {
		WebClient.Builder builder = WebClient.builder()
				.apply(this::applyWebClientResponseExceptionFilter);
		configurers.forEach(builder::apply);
		return builder.build();
	}

	private void applyWebClientResponseExceptionFilter(WebClient.Builder builder) {
		builder.filter(ExchangeFilterFunctions.statusError(HttpStatus::isError,
				WebClientResponseExceptionCreator::createResponseException));
	}

}
