import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Hero } from '../hero/hero';
import { Catalog } from '../catalog/catalog';
import { About } from '../about/about';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Catalog, About, Contact],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
})
export class Home {}
