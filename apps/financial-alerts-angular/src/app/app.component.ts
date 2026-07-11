import { Component } from "@angular/core";

type Filter = "all" | "unread" | "read";
interface FinancialAlert { id: number; severity: "success" | "info" | "warning"; title: string; description: string; action?: string; read: boolean; }

@Component({ selector: "financial-alerts-root", templateUrl: "./app.component.html", styleUrls: ["./app.component.css"] })
export class AppComponent {
  filter: Filter = "all";
  readonly alerts: FinancialAlert[] = [
    { id: 1, severity: "warning", title: "Gastos com alimentação em alta", description: "Alimentação concentra uma parte relevante das suas saídas neste período.", action: "Ver transações", read: false },
    { id: 2, severity: "success", title: "Saldo positivo", description: "Suas entradas superam suas saídas no período analisado.", read: false },
    { id: 3, severity: "info", title: "Revise suas categorias", description: "Categorizar transações melhora a precisão dos gráficos e análises.", read: true },
    { id: 4, severity: "warning", title: "Gastos variáveis acima do esperado", description: "Algumas despesas podem ser revisadas antes do fechamento do mês.", read: false }
  ];
  get visibleAlerts() { return this.alerts.filter((alert) => this.filter === "all" || (this.filter === "read" ? alert.read : !alert.read)); }
  setFilter(filter: Filter) { this.filter = filter; }
  markAsRead(alert: FinancialAlert) { alert.read = true; }
}
