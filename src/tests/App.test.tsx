import { screen, waitForElementToBeRemoved } from '@testing-library/dom';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import NewsProvider from '../context/NewsProvider';
import { render } from '@testing-library/react';
import mockData from './helpers/mockData';
import { DATA_API } from '../services/apiFetchs';

describe('Verifica o funcionamento da página', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => (mockData),
    })

    render(
      <NewsProvider>
        <App />
      </NewsProvider>
    );
  });

  test('Testa se os componentes que não dependem da API são renderizados corretamente', async () => {
    expect(screen.getByRole('heading', {
      name: /trybe news/i
    })).toBeInTheDocument();

    expect(screen.getByRole('img', {
      name: /logo da trybe/i
    })).toBeInTheDocument();

    expect(screen.getByTestId('loading-element')).toBeInTheDocument();
  });

  test('Testa se a API é chamada corretamente', async () => {
    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch).toBeCalledWith(DATA_API);
  });

  test('Testa se os componentes que dependem da API são renderizados corretamente', async () => {
    const loadingEl = screen.getByTestId('loading-element');
    await waitForElementToBeRemoved(loadingEl);

    expect(screen.getByRole('heading', {
      name: /notícia mais recente/i
    })).toBeInTheDocument();

    expect(screen.getByRole('img', {
      name: /imagem na noticia principal/i
    })).toBeInTheDocument();

    expect(screen.getByText('Titulo da primeira notícia')).toBeInTheDocument();

    expect(screen.getByText('Introdução da primeira notícia')).toBeInTheDocument();

    expect(screen.getByText('Titulo da segunda notícia')).toBeInTheDocument();

    expect(screen.getByText('Titulo da terceira notícia')).toBeInTheDocument();

    expect(screen.getByText('Titulo da quarta notícia')).toBeInTheDocument();
  });

  test('Testa se o botão de carregar mais notícias funciona corretamente', async () => {
    const loadingEl = screen.getByTestId('loading-element');
    await waitForElementToBeRemoved(loadingEl);

    const loadBtn = screen.getByRole('button', {
      name: /mais notícias/i
    })

    await userEvent.click(loadBtn);

    expect(screen.getByText('Titulo da decima segunda notícia')).toBeInTheDocument();
  })

  test.only('Testa os botões de filtro e o input', async () => {
    const loadingEl = screen.getByTestId('loading-element');
    await waitForElementToBeRemoved(loadingEl);

    const noticia = screen.getByText('Titulo da terceira notícia');
    const release = screen.getByText('Titulo da segunda notícia');

    const maisRecentesBtn = screen.getByRole('button', {
      name: /mais recentes/i
    });

    const releaseBtn = screen.getByRole('button', {
      name: /mais recentes/i
    });

    const noticiaBtn = screen.getByTestId('news-button');

    const favoritasBtn = screen.getByRole('button', {
      name: /favoritas/i
    });

    const input = screen.getByRole('textbox');

    const emptyHeartBtn = screen.getAllByRole('img', {
      name: /empty heart/i
    });

    expect(noticia).toBeInTheDocument();
    expect(release).toBeInTheDocument();

    // await userEvent.click(releaseBtn);
    // expect(noticia).not.toBeInTheDocument();
    // expect(release).toBeInTheDocument();

    // await userEvent.click(noticiaBtn);
    // expect(noticia).toBeInTheDocument();
    // expect(release).not.toBeInTheDocument();
    
    await userEvent.click(emptyHeartBtn[0]);
    await userEvent.click(favoritasBtn);
    expect(noticia).toBeInTheDocument();
    expect(release).not.toBeInTheDocument();
  });
});
