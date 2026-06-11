import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mois`;
  return `${Math.floor(months / 12)} an`;
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
  return String(n);
}

export function getDisplayName(author: { firstname?: string | null; lastname?: string | null; name?: string | null; username?: string | null }): string {
  return author.firstname && author.lastname
    ? `${author.firstname} ${author.lastname}`
    : (author.name || author.username) ?? "Anonyme";
}

export function getInitialName(author: { firstname?: string | null; lastname?: string | null; name?: string | null; username?: string | null }): string {
  return author.firstname && author.lastname
    ? [author.firstname[0]?.toUpperCase(), author.lastname[0]?.toUpperCase()].join("")
    : (author.name || author.username || "")
        .split(" ")
        .slice(0, 2)
        .map(word => word[0]?.toUpperCase())
        .join("") || "?";
}

export const zodEnum = <T extends Record<string, string>>(e: T) =>
    z.enum(Object.values(e) as [string, ...string[]]);