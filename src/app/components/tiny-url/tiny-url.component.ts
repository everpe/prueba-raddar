import { Component, OnInit } from '@angular/core';
import { TinyUrlService } from '../../services/tiny-url.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
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
  shortUrl: string = '';
  metadata: any = null;
  errorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private tinyUrlService: TinyUrlService
  ) { }

  ngOnInit(): void {
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
      alias: ['', Validators.minLength(5)],
      description: ['']
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
  // onEncode(): void {
  //   if (this.tinyUrlForm.invalid) {
  //     this.tinyUrlForm.markAllAsTouched();
  //     return;
  //   }

  //   const { longUrl, domain, alias, description } = this.tinyUrlForm.value;

  //   const request = {
  //     url: longUrl,
  //     domain: domain || 'tinyurl.com',
  //     alias: alias || undefined,
  //     description: description || undefined,
  //   };

  //   this.tinyUrlService.encode(request).subscribe({
  //     next: (response) => {
  //       this.shortUrl = response.data?.tiny_url || 'No se pudo generar una URL corta.';
  //       this.metadata = response.data; // Almacena todos los metadatos
  //     },
  //     error: (err) => {
  //       console.error('Error al acortar la URL:', err);
  //       alert('Hubo un error al acortar la URL');
  //     },
  //   });
  // }
  onEncode(): void {
    this.errorMessage = ''; // Reiniciar el mensaje de error

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
        this.metadata = response.data; // Almacena todos los metadatos
        this.errorMessage = ''; // Limpiar el error si la petición fue exitosa
      },
      error: (err) => {
        console.error('Error al acortar la URL:', err);
        if (err.error?.errors?.length) {
          this.errorMessage = err.error.errors.join(', ');
        } else {
          this.errorMessage = 'Ocurrió un error desconocido al intentar acortar la URL.';
        }
      },
    });
  }

  // Acceso más sencillo a los controles del formulario
  get longUrl() {
    return this.tinyUrlForm.get('longUrl');
  }

  get alias() {
    return this.tinyUrlForm.get('alias');
  }

  get description() {
    return this.tinyUrlForm.get('description');
  }
}
