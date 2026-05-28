import type { TicketPhase } from '../store/adminStore'
import { store } from '../store/adminStore'

export function BatchesManager() {
  function revenue(batch: TicketPhase) {
    return batch.price * batch.sold
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Lotes</h2>

      {store.ticketTypes
        .flatMap((type) => type.phases)
        .map((b) => {
          const active = b.sold < b.limit

          return (
            <div key={b.id} className="bg-zinc-900 p-4 mb-3">
              <b>{b.name}</b>

              <p>Preço: R$ {b.price}</p>
              <p>Vendidos: {b.sold}</p>
              <p>Limite: {b.limit}</p>

              <p>Receita: R$ {revenue(b)}</p>

              <p>
                Status:
                {active ? ' Ativo' : ' Esgotado'}
              </p>
            </div>
          )
        })}
    </div>
  )
}
