import { Component, OnInit } from '@angular/core';
import { TinyUrlService } from '../../services/tiny-url.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tiny-url',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './tiny-url.component.html',
  styleUrl: './tiny-url.component.css'
})
export class TinyUrlComponent implements OnInit {
  tinyUrlForm!: FormGroup;
  decodeForm!: FormGroup;
  shortUrl: string = '';
  longUrlDecoded: string = '';
  metadata: any = null;
  decodeMetadata: any = null;
  errorMessage: string = '';
  decodeErrorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private tinyUrlService: TinyUrlService
  ) {}

  ngOnInit(): void {
    // Formulario para acortar URL
    this.tinyUrlForm = this.fb.group({
      longUrl: [
        '', 
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(250),
          this.urlValidator
        ]
      ],
      domain: ['tinyurl.com'],
      alias: [''],
      description: ['']
    });

    // Formulario para decodificar URL
    this.decodeForm = this.fb.group({
      shortUrl: [
        '',
        [
          Validators.required,
          this.urlValidator
        ]
      ],
      alias: [
        '',
        [Validators.required]
      ]
    });
  }

  // Validador personalizado para URLs
  urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: 'La URL no es válida' };
    }
  }

  // Método para acortar la URL
  onEncode(): void {
    this.errorMessage = '';

    if (this.tinyUrlForm.invalid) {
      this.tinyUrlForm.markAllAsTouched();
      return;
    }

    const { longUrl, domain, alias, description } = this.tinyUrlForm.value;

    const request = {
      url: longUrl,
      domain: domain || 'tinyurl.com',
      alias: alias || undefined,
      description: description || undefined,
    };

    this.tinyUrlService.encode(request).subscribe({
      next: (response) => {
        this.shortUrl = response.data?.tiny_url || 'No se pudo generar una URL corta.';
        this.metadata = response.data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.errors?.join(', ') || 'Error desconocido al acortar la URL.';
      },
    });
  }

  // Método para decodificar la URL
  onDecode(): void {
    this.decodeErrorMessage = '';

    if (this.decodeForm.invalid) {
      this.decodeForm.markAllAsTouched();
      return;
    }

    const { shortUrl, alias } = this.decodeForm.value;
    const url = new URL(shortUrl);
    const domain = url.hostname;

    this.tinyUrlService.decode(domain, alias).subscribe({
      next: (response) => {
        this.longUrlDecoded = response.data?.url || 'No se pudo obtener la URL original.';
        this.decodeMetadata = response.data;
        this.decodeErrorMessage = '';
      },
      error: (err) => {
        this.decodeErrorMessage = err.error?.errors?.join(', ') || 'Error desconocido al decodificar la URL.';
      },
    });
  }

  // Acceso rápido a los controles
  get longUrl() {
    return this.tinyUrlForm.get('longUrl');
  }

  get shortUrlControl() {
    return this.decodeForm.get('shortUrl');
  }

  get aliasControl() {
    return this.decodeForm.get('alias');
  }
   
}
