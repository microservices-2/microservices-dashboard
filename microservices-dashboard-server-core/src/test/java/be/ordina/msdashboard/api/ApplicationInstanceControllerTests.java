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

import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import be.ordina.msdashboard.applicationinstance.ApplicationInstanceMother;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.verify;
import static org.mockito.BDDMockito.verifyNoMoreInteractions;
import static org.mockito.BDDMockito.when;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class ApplicationInstanceControllerTests {

	@Mock
	private ApplicationInstanceService service;

	@InjectMocks
	private ApplicationInstanceController controller;

	@Test
	public void shouldReturn404ForUnknownApplicationInstance() {
		ResponseEntity response = this.controller.getApplicationInstanceById("unknown");

		assertThat(response).isNotNull();
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

		verify(this.service).getById("unknown");
		verifyNoMoreInteractions(this.service);
	}

	@Test
	public void shouldReturn200ForKnownApplicationInstance() {
		when(this.service.getById("a-1"))
				.thenReturn(Optional.of(ApplicationInstanceMother.instance("a-1", "a")));
		ResponseEntity response = this.controller.getApplicationInstanceById("a-1");

		assertThat(response).isNotNull();
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

		verify(this.service).getById("a-1");
		verifyNoMoreInteractions(this.service);
	}

}
