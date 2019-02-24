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

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpStatus;
import org.springframework.util.MimeType;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.UnknownHttpStatusCodeException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

/**
 * Util class to convert HTTP errors to {@link WebClientResponseException}s.
 * Copied and adapted from {@link org.springframework.web.reactive.function.client.DefaultWebClient.DefaultResponseSpec#createResponseException}
 *
 * @author Tim Ysewyn
 */
final class WebClientResponseExceptionCreator {

	private WebClientResponseExceptionCreator() {
	}

	static WebClientResponseException createResponseException(ClientResponse response) {
		return DataBufferUtils.join(response.body(BodyExtractors.toDataBuffers()))
				.map(dataBuffer -> {
					byte[] bytes = new byte[dataBuffer.readableByteCount()];
					dataBuffer.read(bytes);
					DataBufferUtils.release(dataBuffer);
					return bytes;
				})
				.defaultIfEmpty(new byte[0])
				.map(bodyBytes -> {
					Charset charset = response.headers().contentType()
							.map(MimeType::getCharset)
							.orElse(StandardCharsets.ISO_8859_1);
					if (HttpStatus.resolve(response.rawStatusCode()) != null) {
						return WebClientResponseException.create(
								response.statusCode().value(),
								response.statusCode().getReasonPhrase(),
								response.headers().asHttpHeaders(),
								bodyBytes,
								charset);
					}
					else {
						return new UnknownHttpStatusCodeException(
								response.rawStatusCode(),
								response.headers().asHttpHeaders(),
								bodyBytes,
								charset);
					}
				})
				.block();
	}

}
