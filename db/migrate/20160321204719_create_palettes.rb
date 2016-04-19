class CreatePalettes < ActiveRecord::Migration
  def change
    create_table :palettes do |t|
      t.text :raw
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
