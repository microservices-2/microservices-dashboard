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

import java.util.Collections;
import java.util.Optional;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import reactor.core.publisher.Flux;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.UnknownHttpStatusCodeException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.BDDMockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.verifyZeroInteractions;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class WebClientResponseExceptionCreatorTests {

	@Mock
	private ClientResponse clientResponse;

	@Mock
	private DataBuffer dataBuffer;

	@Mock
	private DataBufferFactory dataBufferFactory;

	@Mock
	private ClientResponse.Headers headers;

	@Before
	public void setup() {
		when(this.clientResponse.body(any())).thenReturn(Flux.fromIterable(Collections.emptyList()));
		when(this.dataBuffer.factory()).thenReturn(this.dataBufferFactory);
		when(this.dataBufferFactory.join(anyList())).thenReturn(this.dataBuffer);
		when(this.clientResponse.headers()).thenReturn(this.headers);
		when(this.headers.contentType()).thenReturn(Optional.empty());
		when(this.headers.asHttpHeaders()).thenReturn(HttpHeaders.EMPTY);
	}

	@After
	public void verifyMocks() {
		verify(this.clientResponse).body(any());
		verify(this.clientResponse, times(2)).headers();
		verifyNoMoreInteractions(this.clientResponse);
		verify(this.headers).contentType();
		verify(this.headers).asHttpHeaders();
		verifyNoMoreInteractions(this.headers);
	}

	@Test
	public void shouldThrow404WithoutBody() {
		when(this.clientResponse.statusCode()).thenReturn(HttpStatus.NOT_FOUND);
		when(this.clientResponse.rawStatusCode()).thenReturn(404);

		WebClientResponseException exception =
				WebClientResponseExceptionCreator.createResponseException(this.clientResponse);

		assertThat(exception).isInstanceOf(WebClientResponseException.NotFound.class);

		verify(this.clientResponse).rawStatusCode();
		verify(this.clientResponse, times(2)).statusCode();
		verifyZeroInteractions(this.dataBuffer);
		verifyZeroInteractions(this.dataBufferFactory);
	}

	@Test
	public void shouldThrow404WithBody() {
		when(this.clientResponse.body(any())).thenReturn(Flux.fromIterable(Collections.singletonList(this.dataBuffer)));
		when(this.clientResponse.statusCode()).thenReturn(HttpStatus.NOT_FOUND);
		when(this.clientResponse.rawStatusCode()).thenReturn(404);

		WebClientResponseException exception =
				WebClientResponseExceptionCreator.createResponseException(this.clientResponse);

		assertThat(exception).isInstanceOf(WebClientResponseException.NotFound.class);

		verify(this.clientResponse).rawStatusCode();
		verify(this.clientResponse, times(2)).statusCode();
		verify(this.dataBuffer).factory();
		verify(this.dataBufferFactory).join(anyList());
	}

	@Test
	public void shouldThrowUnknownStatusException() {
		when(this.clientResponse.body(any())).thenReturn(Flux.fromIterable(Collections.singletonList(this.dataBuffer)));
		when(this.clientResponse.rawStatusCode()).thenReturn(499);

		WebClientResponseException exception =
				WebClientResponseExceptionCreator.createResponseException(this.clientResponse);

		assertThat(exception).isInstanceOf(UnknownHttpStatusCodeException.class);

		verify(this.clientResponse, times(2)).rawStatusCode();
		verify(this.dataBuffer).factory();
		verify(this.dataBufferFactory).join(anyList());
	}

}
