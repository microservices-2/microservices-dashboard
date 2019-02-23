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

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import be.ordina.msdashboard.catalog.Catalog;
import be.ordina.msdashboard.catalog.CatalogService;

import org.springframework.hateoas.ExposesResourceFor;
import org.springframework.hateoas.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 * Controller that exposes the catalog.
 *
 * @author Tim Ysewyn
 */
@ExposesResourceFor(CatalogResource.class)
@RestController
@RequestMapping("/catalog")
public class CatalogController {

	private final CatalogService service;

	public CatalogController(CatalogService service) {
		this.service = service;
	}

	@GetMapping
	public CatalogResource getCatalog() {
		Catalog catalog = this.service.getCatalog();
		List<Resource<String>> applicationInstanceResources = catalog.getApplications()
				.stream()
				.map(catalog::getApplicationInstancesForApplication)
				.flatMap(Collection::stream)
				.map(applicationInstance -> {
					Resource<String> resource = new Resource<>(applicationInstance);
					resource.add(linkTo(ApplicationInstanceController.class)
							.slash(applicationInstance)
							.withSelfRel());
					return resource;
				})
				.collect(Collectors.toList());
		return new CatalogResource(applicationInstanceResources);
	}
}
