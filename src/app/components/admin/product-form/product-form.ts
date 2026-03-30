import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { ImageUpload } from '../image-upload/image-upload';

const ALL_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];
const ALL_TAGS = ['Top', 'Legging', 'Conjunto', 'Short', 'Regata', 'Outro'];

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImageUpload],
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);

  allSizes = ALL_SIZES;
  allTags = ALL_TAGS;
  isEdit = signal(false);
  editId = signal<number | null>(null);
  saving = signal(false);
  error = signal('');

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    tag: new FormControl('Top', Validators.required),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0.01)]),
    deliveryDays: new FormControl('5–10 dias úteis', Validators.required),
    description: new FormControl('', Validators.required),
    texture: new FormControl('', Validators.required),
    sizes: new FormArray(ALL_SIZES.map(() => new FormControl(false))),
    images: new FormArray([this.newImageCtrl()]),
    colors: new FormArray([this.newColorGroup()]),
  });

  get sizesArray() { return this.form.get('sizes') as FormArray; }
  get imagesArray() { return this.form.get('images') as FormArray; }
  get colorsArray() { return this.form.get('colors') as FormArray; }

  colorImages(colorIdx: number) {
    return (this.colorsArray.at(colorIdx) as FormGroup).get('images') as FormArray;
  }

  private newImageCtrl() { return new FormControl(''); }

  private newColorGroup() {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      hex: new FormControl('#F472B6', Validators.required),
      images: new FormArray([new FormControl('')]),
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId.set(Number(id));
      this.catalogService.getOne(Number(id)).subscribe((item) => {
        this.form.patchValue({
          title: item.title,
          tag: item.tag,
          price: item.price,
          deliveryDays: item.deliveryDays,
          description: item.description,
          texture: item.texture,
        });
        // Sizes
        ALL_SIZES.forEach((s, i) => {
          this.sizesArray.at(i).setValue(item.sizes.includes(s));
        });
        // Images
        while (this.imagesArray.length) this.imagesArray.removeAt(0);
        item.images.forEach((url) => this.imagesArray.push(new FormControl(url)));
        if (this.imagesArray.length === 0) this.imagesArray.push(this.newImageCtrl());
        // Colors
        while (this.colorsArray.length) this.colorsArray.removeAt(0);
        item.colors.forEach((c) => {
          const grp = this.newColorGroup();
          grp.patchValue({ name: c.name, hex: c.hex });
          const imgs = grp.get('images') as FormArray;
          while (imgs.length) imgs.removeAt(0);
          c.images.forEach((url) => imgs.push(new FormControl(url)));
          if (imgs.length === 0) imgs.push(new FormControl(''));
          this.colorsArray.push(grp);
        });
        if (this.colorsArray.length === 0) this.colorsArray.push(this.newColorGroup());
      });
    }
  }

  addImage() { this.imagesArray.push(this.newImageCtrl()); }
  removeImage(i: number) { if (this.imagesArray.length > 1) this.imagesArray.removeAt(i); }
  setImageUrl(i: number, url: string) { this.imagesArray.at(i).setValue(url); }

  addColor() { this.colorsArray.push(this.newColorGroup()); }
  removeColor(i: number) { if (this.colorsArray.length > 1) this.colorsArray.removeAt(i); }
  addColorImage(colorIdx: number) { this.colorImages(colorIdx).push(new FormControl('')); }
  removeColorImage(colorIdx: number, imgIdx: number) {
    const arr = this.colorImages(colorIdx);
    if (arr.length > 1) arr.removeAt(imgIdx);
  }
  setColorImageUrl(colorIdx: number, imgIdx: number, url: string) {
    this.colorImages(colorIdx).at(imgIdx).setValue(url);
  }

  submit(): void {
    if (this.form.invalid) { this.error.set('Preencha todos os campos obrigatórios.'); return; }
    this.saving.set(true);
    this.error.set('');

    const v = this.form.value;
    const selectedSizes = ALL_SIZES.filter((_, i) => v.sizes?.[i]);
    const images = (v.images as string[]).filter(Boolean);
    const colors = (v.colors as { name: string; hex: string; images: string[] }[]).map((c) => ({
      name: c.name,
      hex: c.hex,
      images: c.images.filter(Boolean),
    }));

    const payload = {
      title: v.title!,
      tag: v.tag!,
      price: Number(v.price),
      deliveryDays: v.deliveryDays!,
      description: v.description!,
      texture: v.texture!,
      sizes: selectedSizes,
      images,
      image: images[0] ?? '',
      colors,
    };

    const obs = this.isEdit()
      ? this.catalogService.update(this.editId()!, payload)
      : this.catalogService.create(payload);

    obs.subscribe({
      next: () => this.router.navigate(['/admin/produtos']),
      error: () => {
        this.error.set('Erro ao salvar. Tente novamente.');
        this.saving.set(false);
      },
    });
  }
}
