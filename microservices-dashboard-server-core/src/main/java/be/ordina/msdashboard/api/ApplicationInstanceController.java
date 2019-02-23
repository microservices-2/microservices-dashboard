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

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceService;

import org.springframework.hateoas.ExposesResourceFor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller that exposes the {@link ApplicationInstance application instance}s.
 *
 * @author Tim Ysewyn
 */
@ExposesResourceFor(ApplicationInstanceResource.class)
@RestController
@RequestMapping("/application-instances")
class ApplicationInstanceController {

	private final ApplicationInstanceService service;
	private final ApplicationInstanceResourceAssembler assembler;

	ApplicationInstanceController(ApplicationInstanceService service) {
		this.service = service;
		this.assembler = new ApplicationInstanceResourceAssembler();
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApplicationInstanceResource> getApplicationInstanceById(@PathVariable("id") String id) {
		return this.service.getById(id)
				.map(applicationInstance -> ResponseEntity.ok(this.assembler.toResource(applicationInstance)))
				.orElse(ResponseEntity.notFound().build());
	}

}
