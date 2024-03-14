import { Cates } from "../../types/cates.types";
import { db } from "../database/db";

export const get_cates_service = async () => {
  console.log(`Getting all cates`);
  try {
    const query = `SELECT * FROM cates`;
    const respond = await db.any(query);
    return respond;
  } catch (error) {
    console.log(`Failed getting cates ${error}`)
    return ({ error: `DB error` })
  }
}

export const get_cate_service = async (id: number) => {
  console.log(`Getting cate: ${id}`)
  try {
    const query = `SELECT * FROM cates WHERE id = $<id>`;
    const respond = await db.oneOrNone(query, { id });
    return respond;
  } catch (error) {
    console.log(`Failed getting a cates ${error}`)
    return ({ error: `DB error` })
  }
}

export const add_cate_service = async (model: Omit<Cates, "id">) => {
  console.log(`Adding new cate: ${model.name}`);
  try {
    const query = `INSERT INTO cates (name, unit_type)
                    VALUES ($<name>, $<unit_type>)`;
    const respond = await db.none(query, { ...model });
    return respond;
  } catch (error) {
    console.log(`Failed adding new cate ${error}`)
    return ({ error: `DB error` })
  }
}

export const update_cate_service = async (model: Cates) => {
  console.log(`Updating cate: ${model.id}`);
  try {
    const query = `UPDATE cates 
                    SET name = $<name>,
                      unit_type = $<unit_type>
                    WHERE id = $<id>`;

    const respond = await db.none(query, { ...model });
    return respond;
  } catch (error) {
    console.log(`Failed updating cate ${error}`)
    return ({ error: `DB error` })
  }
}

export const remove_cate_service = async (id: number) => {
  console.log(`Deleting cate: ${id}`);
  try {
    const query = `DELETE FROM cates WHERE id = $<id>`
    const respond = await db.none(query, { id });
    return respond;
  } catch (error) {
    console.log(`Failed deleting cate ${error}`)
    return ({ error: `DB error` })
  }
}
