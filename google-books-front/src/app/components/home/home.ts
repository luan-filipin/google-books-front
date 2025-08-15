import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true, // marca como standalone
  imports: [CommonModule, FormsModule], // HttpClient não precisa explicitamente
  templateUrl: './home.html',
  styleUrls: ['./home.css'] // corrigido
})
export class Home {

    // ...existing code...
  mostrarFormulario: boolean = false;
  mostrarFormularioAtualizacao: boolean = false;
  mostrarPesquisa: boolean = false;
  mostrarExclusao: boolean = false;
  mostrarAtualizador: boolean = false;
  mostrarPesquisaAtualizacao: boolean = false;
  mensagem: string = '';
  isbn: string = '';
  livro: any = null;

  constructor(private http: HttpClient) {}

  livroAtualizado = {
    titulo: '',
    autor: '',
    isbn: '',
    categoria: '',
    dataPublicacao: ''
  }
  
  novoLivro = {
  titulo: '',
  autor: '',
  isbn: '',
  categoria: '',
  dataPublicacao: ''
  };

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.mostrarPesquisa = false;
    this.mostrarAtualizador = false;
    this.mostrarExclusao = false;
    this.mostrarPesquisaAtualizacao = false;
    this.livro = null; 
    this.mensagem = '';
  }

  abrirPesquisa() {
    this.mostrarPesquisa = true;
    this.mostrarExclusao = false;
    this.mostrarAtualizador = false;
    this.mostrarFormulario = false;
    this.mostrarPesquisaAtualizacao = false;
    this.mensagem = '';
  }

  abrirExclusao() {
    this.mostrarExclusao = true;
    this.mostrarFormulario = false;
    this.mostrarAtualizador = false;
    this.mostrarPesquisa = false;
    this.mostrarPesquisaAtualizacao = false;
    this.mensagem = '';
    this.livro = null; 
    this.isbn = '';
  }

  abrirPesquisaAtualizacao() {
    this.mostrarPesquisaAtualizacao = true;
    this.mostrarAtualizador = false;
    this.mostrarFormulario = false;
    this.mostrarPesquisa = false;
    this.mostrarExclusao = false;
    this.livro = null; 
    this.mensagem = '';
  }
  
  abrirAtualizador() {
    this.mostrarAtualizador = true;
    this.mostrarFormulario = false;
    this.mostrarPesquisa = false;
    this.mostrarExclusao = false;
    this.livro = null; 
    this.mensagem = '';
  }
  fecharFormulario() {
    this.mostrarFormulario = false;
  }

  fecharPesquisa() {
    this.mostrarPesquisa = false;
  }

  fecharExclusao() {
    this.mostrarExclusao = false; 
  }
  fecharAtualizador() {
    this.mostrarAtualizador = false;
  }

/*Cria um livro.*/
criarLivro() {
  this.http.post('http://localhost:8080/api/livros', this.novoLivro)
    .subscribe({
      next: () => {
        this.mensagem = 'Livro criado com sucesso!';
        this.novoLivro = { titulo: '', autor: '', isbn: '', categoria: '', dataPublicacao: '' };
        this.fecharFormulario();
      },
      error: (err) => {
        if (err.error) {
          if (Array.isArray(err.error.erros) && err.error.erros.length > 0) {
            this.mensagem = err.error.erros[0].mensagem; 
          } else {
            this.mensagem = err.error.mensagem || 'Erro ao criar livro.';
          }
        } else {
          this.mensagem = 'Erro ao criar livro.';
        }
      }

    });
}

/*Atualizar um livro.*/
atualizaLivro() {
  const isbnAtualizado = this.livroAtualizado.isbn;
  this.http.put(`http://localhost:8080/api/livros?isbn=${isbnAtualizado}`, this.livroAtualizado)
    .subscribe({
      next: () => {
        this.mensagem = 'Livro atualizado com sucesso!';
        this.fecharAtualizador();
      },
      error: (err) => {
        if (err.error) {
          if (Array.isArray(err.error.erros) && err.error.erros.length > 0) {
            this.mensagem = err.error.erros[0].mensagem; 
          } else {
            this.mensagem = err.error.mensagem || 'Erro ao atualizar livro.';
          }
        } else {
          this.mensagem = 'Erro ao atualizar livro.';
        }
      }

    });
}



/*Exlui um livro.*/
deletarLivro() {
  this.http.delete(`http://localhost:8080/api/livros?isbn=${this.isbn}`)
    .subscribe({
      next: () => {
        this.mensagem = 'Livro excluido com sucesso!';
        this.fecharExclusao();
      },
      error: (err) => {
        if (err.error) {
          if (Array.isArray(err.error.erros) && err.error.erros.length > 0) {
            this.mensagem = err.error.erros[0].mensagem; 
          } else {
            this.mensagem = err.error.mensagem || 'Erro ao criar livro.';
          }
        } else {
          this.mensagem = 'Erro ao deletar livro.';
        }
      }

    });
}

/*Busca um livro pelo ISBN.*/
pesquisar() {
  this.http
    .get(`http://localhost:8080/api/livros?isbn=${this.isbn}`)
    .subscribe((res) => {
      this.livro = res;
    });
  }


/*Busca um livro para atualizar pelo ISBN.*/
pesquisarAtualizador() {
  this.http
    .get<any>(`http://localhost:8080/api/livros?isbn=${this.isbn}`)
    .subscribe((res) => {
      this.livroAtualizado = res; // já vem no formato certo
      this.mostrarAtualizador = true;
      this.mostrarPesquisaAtualizacao = false;
    });
}
}

